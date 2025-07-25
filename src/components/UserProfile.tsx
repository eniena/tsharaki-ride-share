import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  Phone, 
  Shield, 
  Edit,
  Car,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import driverImage from "@/assets/driver-hero.jpg";

interface UserProfileProps {
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    userType: 'driver' | 'passenger';
    rating: number;
    totalRides: number;
    memberSince: string;
    isVerified: boolean;
    bio?: string;
  };
}

const SAMPLE_USER = {
  id: "1",
  name: "أحمد المزوغي",
  email: "ahmed.mezoughi@email.com",
  phone: "+212 6 12 34 56 78",
  avatar: driverImage,
  userType: "driver" as const,
  rating: 4.8,
  totalRides: 47,
  memberSince: "يناير 2023",
  isVerified: true,
  bio: "سائق محترف مع خبرة 5 سنوات. أحب السفر والتعرف على أشخاص جدد. سيارة نظيفة ومريحة دائماً."
};

const SAMPLE_RIDES = [
  {
    id: "1",
    type: "completed",
    from: "الرباط",
    to: "الدار البيضاء", 
    date: "2024-01-15",
    passengers: 3,
    rating: 5
  },
  {
    id: "2",
    type: "upcoming",
    from: "فاس",
    to: "مراكش",
    date: "2024-01-25",
    passengers: 2
  },
  {
    id: "3",
    type: "completed",
    from: "الدار البيضاء",
    to: "أكادير",
    date: "2024-01-10",
    passengers: 4,
    rating: 4
  }
];

const SAMPLE_REVIEWS = [
  {
    id: "1",
    reviewer: "فاطمة الزهراء",
    rating: 5,
    comment: "سائق ممتاز، وقت دقيق، سيارة نظيفة ومريحة. أنصح بشدة!",
    date: "2024-01-15",
    route: "الرباط - الدار البيضاء"
  },
  {
    id: "2", 
    reviewer: "محمد الأمين",
    rating: 5,
    comment: "رحلة رائعة، محادثة لطيفة، قيادة آمنة. شكراً أحمد!",
    date: "2024-01-10",
    route: "الدار البيضاء - أكادير"
  },
  {
    id: "3",
    reviewer: "ليلى بنعلي",
    rating: 4,
    comment: "سائق جيد ولكن كان هناك تأخير بسيط. بشكل عام تجربة جيدة.",
    date: "2024-01-05",
    route: "فاس - الرباط"
  }
];

export const UserProfile = ({ user = SAMPLE_USER }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "upcoming":
        return <Clock className="w-4 h-4 text-primary" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case "completed":
        return "مكتملة";
      case "upcoming":
        return "قادمة";
      case "cancelled":
        return "ملغية";
      default:
        return "غير معروف";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-card-foreground">{user.name}</h1>
                  {user.isVerified && (
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <Shield className="w-3 h-3 mr-1" />
                      موثق
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{user.userType === 'driver' ? 'سائق' : 'راكب'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>عضو منذ {user.memberSince}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 md:ml-8">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="text-2xl font-bold text-card-foreground">{user.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">التقييم</p>
              </div>
              
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-card-foreground">{user.totalRides}</span>
                </div>
                <p className="text-sm text-muted-foreground">الرحلات</p>
              </div>
              
              <div className="text-center p-4 bg-background/50 rounded-lg col-span-2 md:col-span-1">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-2xl font-bold text-card-foreground">98%</span>
                </div>
                <p className="text-sm text-muted-foreground">معدل الإتمام</p>
              </div>
            </div>

            {/* Action Button */}
            <Button variant="outline" className="self-start">
              <Edit className="w-4 h-4 mr-2" />
              تعديل الملف
            </Button>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mt-6 p-4 bg-background/30 rounded-lg">
              <p className="text-card-foreground">{user.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="rides">الرحلات</TabsTrigger>
          <TabsTrigger value="reviews">التقييمات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Activity */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {SAMPLE_RIDES.slice(0, 3).map(ride => (
                  <div key={ride.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(ride.type)}
                      <div>
                        <p className="font-medium text-card-foreground">
                          {ride.from} ← {ride.to}
                        </p>
                        <p className="text-sm text-muted-foreground">{ride.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {getStatusText(ride.type)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  إحصائيات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الرحلات هذا الشهر</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">متوسط التقييم</span>
                    <span className="font-semibold">{user.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">معدل الاستجابة</span>
                    <span className="font-semibold">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المسار الأكثر</span>
                    <span className="font-semibold">الرباط - الدار البيضاء</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rides" className="space-y-4">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                جميع الرحلات ({SAMPLE_RIDES.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAMPLE_RIDES.map(ride => (
                  <div key={ride.id} className="border border-border/50 rounded-lg p-4 hover:shadow-warm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(ride.type)}
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {ride.from} ← {ride.to}
                          </h3>
                          <p className="text-sm text-muted-foreground">{ride.date}</p>
                        </div>
                      </div>
                      <Badge variant={ride.type === 'completed' ? 'default' : 'outline'}>
                        {getStatusText(ride.type)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{ride.passengers} ركاب</span>
                      </div>
                      {ride.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span>{ride.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                التقييمات والمراجعات ({SAMPLE_REVIEWS.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {SAMPLE_REVIEWS.map(review => (
                  <div key={review.id} className="border border-border/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {review.reviewer.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-card-foreground">{review.reviewer}</h4>
                          <p className="text-sm text-muted-foreground">{review.route} • {review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-accent text-accent' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-card-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};