import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SearchFilters } from "@/components/SearchFilters";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const [currentUser] = useState({
    name: "محمد الأمين",
    avatar: "",
    userType: "passenger" as const
  });

  const [rides, setRides] = useState(SAMPLE_RIDES);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (filters: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`تم العثور على ${rides.length} رحلة من ${filters.from} إلى ${filters.to}`);
      setIsLoading(false);
    }, 1000);
  };

  const handleBookRide = (rideId: string) => {
    const ride = rides.find(r => r.id === rideId);
    if (ride) {
      toast.success(`تم حجز مقعد في رحلة ${ride.driver.name} بنجاح!`);
      // Update available seats
      setRides(prev => prev.map(r => 
        r.id === rideId 
          ? { ...r, availableSeats: r.availableSeats - 1 }
          : r
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      <Navigation currentUser={currentUser} />
      
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
            <Button variant="hero" size="xl">
              <Users className="w-5 h-5 mr-2" />
              ابحث عن رحلة
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <MapPin className="w-5 h-5 mr-2" />
              أضف رحلتك
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <SearchFilters onSearch={handleSearch} />
        </div>

        {/* Available Rides */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">الرحلات المتاحة</h2>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {rides.length} رحلة
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">جاري البحث عن الرحلات...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rides.map(ride => (
                <RideCard 
                  key={ride.id} 
                  ride={ride} 
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
                <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                  إنشاء حساب جديد
                </Button>
                <Button variant="hero" size="lg" className="bg-white/20 hover:bg-white/30">
                  <Clock className="w-5 h-5 mr-2" />
                  ابدأ رحلتك الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}