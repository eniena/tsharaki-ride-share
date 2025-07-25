-- Create enum types for user preferences
CREATE TYPE user_type AS ENUM ('driver', 'passenger');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE gender_preference AS ENUM ('any', 'men', 'women');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create users table (extending the existing profiles functionality)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  user_type user_type NOT NULL DEFAULT 'passenger',
  gender gender_type,
  cin_verified BOOLEAN NOT NULL DEFAULT false,
  profile_picture TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trips table
CREATE TABLE public.trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  price_per_seat DECIMAL(10,2) NOT NULL,
  total_seats INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  gender_preference gender_preference NOT NULL DEFAULT 'any',
  car_model TEXT,
  car_plate TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_seats CHECK (available_seats <= total_seats AND available_seats >= 0),
  CONSTRAINT check_price CHECK (price_per_seat > 0),
  CONSTRAINT check_departure_future CHECK (departure_time > now())
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'pending',
  seats_booked INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, passenger_id),
  CONSTRAINT check_seats_positive CHECK (seats_booked > 0)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trips table
CREATE POLICY "Anyone can view trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Drivers can insert their own trips" ON public.trips FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND users.id = trips.driver_id AND users.user_type = 'driver')
);
CREATE POLICY "Drivers can update their own trips" ON public.trips FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND users.id = trips.driver_id)
);
CREATE POLICY "Drivers can delete their own trips" ON public.trips FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND users.id = trips.driver_id)
);

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND (users.id = bookings.passenger_id OR users.id IN (SELECT driver_id FROM public.trips WHERE trips.id = bookings.trip_id)))
);
CREATE POLICY "Passengers can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND users.id = bookings.passenger_id)
);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.user_id = auth.uid() AND (users.id = bookings.passenger_id OR users.id IN (SELECT driver_id FROM public.trips WHERE trips.id = bookings.trip_id)))
);

-- Create indexes for better performance
CREATE INDEX idx_trips_route ON public.trips(from_location, to_location);
CREATE INDEX idx_trips_departure ON public.trips(departure_time);
CREATE INDEX idx_trips_driver ON public.trips(driver_id);
CREATE INDEX idx_bookings_trip ON public.bookings(trip_id);
CREATE INDEX idx_bookings_passenger ON public.bookings(passenger_id);
CREATE INDEX idx_users_auth_id ON public.users(user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update available seats when booking
CREATE OR REPLACE FUNCTION public.update_trip_seats()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    UPDATE public.trips 
    SET available_seats = available_seats - NEW.seats_booked
    WHERE id = NEW.trip_id;
    RETURN NEW;
  END IF;
  
  -- Handle UPDATE
  IF TG_OP = 'UPDATE' THEN
    -- If status changed from confirmed to cancelled, add seats back
    IF OLD.status = 'confirmed' AND NEW.status = 'cancelled' THEN
      UPDATE public.trips 
      SET available_seats = available_seats + OLD.seats_booked
      WHERE id = OLD.trip_id;
    -- If status changed from pending/cancelled to confirmed, remove seats
    ELSIF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE public.trips 
      SET available_seats = available_seats - NEW.seats_booked
      WHERE id = NEW.trip_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.status = 'confirmed' THEN
      UPDATE public.trips 
      SET available_seats = available_seats + OLD.seats_booked
      WHERE id = OLD.trip_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for seat management
CREATE TRIGGER update_trip_seats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_trip_seats();