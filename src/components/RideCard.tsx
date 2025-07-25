import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Users, Car, DollarSign } from "lucide-react";

interface RideCardProps {
  ride: {
    id: string;
    driver: {
      name: string;
      rating: number;
      avatar?: string;
      carModel: string;
    };
    from: string;
    to: string;
    departureTime: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
    preferences: string[];
  };
  onBook?: (rideId: string) => void;
}

export const RideCard = ({ ride, onBook }: RideCardProps) => {
  const handleBooking = () => {
    onBook?.(ride.id);
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-warm transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        {/* Driver Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarImage src={ride.driver.avatar} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
              {ride.driver.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground">{ride.driver.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm text-muted-foreground">{ride.driver.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Car className="w-4 h-4" />
              <span>{ride.driver.carModel}</span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium text-card-foreground">{ride.from}</div>
              <div className="text-sm text-muted-foreground">إلى {ride.to}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{ride.departureTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {ride.availableSeats}/{ride.totalSeats} متاح
              </span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {ride.preferences.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ride.preferences.map((pref, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {pref}
              </Badge>
            ))}
          </div>
        )}

        {/* Price and Booking */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-primary">{ride.price} MAD</span>
            <span className="text-sm text-muted-foreground">للمقعد</span>
          </div>
          
          <Button 
            variant="moroccan" 
            size="lg"
            onClick={handleBooking}
            disabled={ride.availableSeats === 0}
          >
            {ride.availableSeats === 0 ? 'مكتمل' : 'احجز الآن'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};