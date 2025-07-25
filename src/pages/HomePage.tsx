import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchFilters, type SearchFilters as SearchFiltersType } from "@/components/SearchFilters";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  MapPin, 
  Clock, 
  Star, 
  Shield, 
  Users,
  Zap,
  Phone
} from "lucide-react";
import heroImage from "@/assets/tsharaki-hero.jpg";
import driverImage from "@/assets/driver-hero.jpg";

// Mock data for demonstration
const SAMPLE_RIDES = [
  {
    id: "1",
    driver: {
      name: "أحمد المزوغي",
      rating: 4.8,
      avatar: driverImage,
      carModel: "تويوتا كامري 2022"
    },
    from: "الرباط",
    to: "الدار البيضاء",
    departureTime: "غداً 14:30",
    price: 80,
    availableSeats: 3,
    totalSeats: 4,
    preferences: ["غير مدخنين", "مكيف الهواء", "موسيقى"]
  },
  {
    id: "2", 
    driver: {
      name: "فاطمة الزهراء",
      rating: 4.9,
      carModel: "رينو ميجان 2021"
    },
    from: "فاس",
    to: "مراكش", 
    departureTime: "اليوم 19:00",
    price: 150,
    availableSeats: 2,
    totalSeats: 3,
    preferences: ["نساء فقط", "غير مدخنين", "صامت"]
  },
  {
    id: "3",
    driver: {
      name: "يوسف البنيني",
      rating: 4.7,
      carModel: "هيونداي توكسون 2023"
    },
    from: "طنجة",
    to: "أكادير",
    departureTime: "بعد غد 08:00", 
    price: 220,
    availableSeats: 1,
    totalSeats: 4,
    preferences: ["مكيف الهواء", "أمتعة كبيرة", "توقفات قليلة"]
  }
];

const TRUST_FEATURES = [
  {
    icon: Shield,
    title: "التحقق من الهوية",
    description: "جميع السائقين والركاب معرفون بوثائق رسمية"
  },
  {
    icon: Star,
    title: "نظام التقييم",
    description: "تقييمات شفافة من المجتمع لضمان الجودة"
  },
  {
    icon: Phone,
    title: "الاتصال الطارئ",
    description: "زر طوارئ مباشر للأمان الكامل"
  },
  {
    icon: Zap,
    title: "دفع آمن",
    description: "محفظة إلكترونية آمنة أو الدفع عند الوصول"
  }
];

export default function HomePage() {
  const { user, currentUserProfile } = useAuth();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          users!trips_driver_id_fkey (
            name,
            profile_picture,
            rating,
            user_type
          )
        `)
        .gte('departure_time', new Date().toISOString())
        .gt('available_seats', 0)
        .order('departure_time', { ascending: true });

      if (error) throw error;
      
      setTrips(data || []);
      setFilteredTrips(data || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast.error('خطأ في تحميل الرحلات');
    }
  };

  const handleSearch = async (filters: any) => {
    setIsLoading(true);
    
    let filtered = [...trips];

    // Filter by route (case-insensitive partial match)
    if (filters.from) {
      filtered = filtered.filter(trip => 
        trip.from_location.toLowerCase().includes(filters.from.toLowerCase())
      );
    }
    
    if (filters.to) {
      filtered = filtered.filter(trip => 
        trip.to_location.toLowerCase().includes(filters.to.toLowerCase())
      );
    }

    // Filter by date
    if (filters.date) {
      const filterDate = filters.date.toISOString().split('T')[0];
      filtered = filtered.filter(trip => 
        trip.departure_time.split('T')[0] >= filterDate
      );
    }

    // Filter by available seats
    if (filters.passengers > 1) {
      filtered = filtered.filter(trip => 
        trip.available_seats >= filters.passengers
      );
    }

    // Filter by max price
    if (filters.maxPrice) {
      filtered = filtered.filter(trip => 
        trip.price_per_seat <= filters.maxPrice
      );
    }

    // Filter by gender preference
    if (filters.genderPreference) {
      const genderMap: { [key: string]: string } = {
        'men': 'men',
        'women': 'women'
      };
      
      filtered = filtered.filter(trip => 
        trip.gender_preference === 'any' || 
        trip.gender_preference === genderMap[filters.genderPreference || '']
      );
    }

    setTimeout(() => {
      setFilteredTrips(filtered);
      toast.success(`تم العثور على ${filtered.length} رحلة`);
      setIsLoading(false);
    }, 500);
  };

  const handleBookRide = async (tripId: string) => {
    if (!user) {
      setShowAuthModal(true);
      toast.error('يجب تسجيل الدخول أولاً للحجز');
      return;
    }

    if (!currentUserProfile) {
      toast.error('يرجى إكمال ملفك الشخصي أولاً');
      return;
    }

    const trip = filteredTrips.find((t: any) => t.id === tripId);
    if (!trip || trip.available_seats <= 0) {
      toast.error('عذراً، لا توجد مقاعد متاحة');
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          trip_id: tripId,
          passenger_id: currentUserProfile.id,
          seats_booked: 1,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('تم إرسال طلب الحجز بنجاح! سيتم إشعارك عند الموافقة');
      fetchTrips(); // Refresh trips to update available seats
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('لديك حجز مسبق لهذه الرحلة');
      } else {
        toast.error('خطأ في الحجز: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-moroccan opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            مرحباً بك في تشاركي
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            ابحث عن رحلات مشتركة آمنة ومريحة في جميع أنحاء المغرب
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-5 h-5 mr-2" />
              ابحث عن رحلة
            </Button>
            {user ? (
              <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                <MapPin className="w-5 h-5 mr-2" />
                أضف رحلتك
              </Button>
            ) : (
              <AuthModal
                trigger={
                  <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                    <MapPin className="w-5 h-5 mr-2" />
                    أضف رحلتك
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div id="search-section" className="mb-12">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {/* Available Rides */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">الرحلات المتاحة</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {filteredTrips.length} رحلة
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري البحث عن الرحلات...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">لا توجد رحلات متاحة حالياً</p>
              <p className="text-sm text-muted-foreground mt-2">جرب تغيير معايير البحث</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip: any) => (
                <RideCard 
                  key={trip.id} 
                  ride={{
                    id: trip.id,
                    driver: {
                      name: trip.users?.name || 'سائق',
                      rating: trip.users?.rating || 0,
                      avatar: trip.users?.profile_picture || '',
                      carModel: trip.car_model || ''
                    },
                    from: trip.from_location,
                    to: trip.to_location,
                    departureTime: new Date(trip.departure_time).toLocaleString('ar-MA'),
                    price: trip.price_per_seat,
                    availableSeats: trip.available_seats,
                    totalSeats: trip.total_seats,
                    preferences: trip.notes ? [trip.notes] : []
                  }} 
                  onBook={handleBookRide}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trust & Safety Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              لماذا تشاركي؟
            </h2>
            <p className="text-xl text-muted-foreground">
              نحن نضع الأمان والثقة في المقدمة
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {TRUST_FEATURES.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 shadow-card hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-moroccan rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <Card className="bg-gradient-moroccan border-none shadow-glow">
            <CardContent className="p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                انضم إلى مجتمع تشاركي اليوم
              </h2>
              <p className="text-xl mb-8 opacity-90">
                سافر بأمان وراحة، واوفر المال، والتق بأشخاص جدد
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button variant="hero" size="lg" className="bg-white/20 hover:bg-white/30">
                    <Clock className="w-5 h-5 mr-2" />
                    ابدأ رحلتك الآن
                  </Button>
                ) : (
                  <>
                    <AuthModal
                      trigger={
                        <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                          إنشاء حساب جديد
                        </Button>
                      }
                    />
                    <AuthModal
                      trigger={
                        <Button variant="hero" size="lg" className="bg-white/20 hover:bg-white/30">
                          <Clock className="w-5 h-5 mr-2" />
                          ابدأ رحلتك الآن
                        </Button>
                      }
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      
      {/* Auth Modal for non-authenticated users */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </div>
  );
}