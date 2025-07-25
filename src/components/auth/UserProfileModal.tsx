import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, LogOut, Save, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { user, signOut, currentUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone_number: '',
    user_type: 'passenger' as 'driver' | 'passenger',
    gender: 'male' as 'male' | 'female' | 'other'
  });
  const [userTrips, setUserTrips] = useState([]);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    if (currentUserProfile) {
      setProfileData({
        name: currentUserProfile.name || '',
        phone_number: currentUserProfile.phone_number || '',
        user_type: currentUserProfile.user_type || 'passenger',
        gender: currentUserProfile.gender || 'male'
      });
    }
  }, [currentUserProfile]);

  useEffect(() => {
    if (open && currentUserProfile?.id) {
      fetchUserData();
    }
  }, [open, currentUserProfile?.id]);

  const fetchUserData = async () => {
    if (!currentUserProfile?.id) return;

    try {
      // Fetch user's trips (if driver)
      if (currentUserProfile.user_type === 'driver') {
        const { data: trips } = await supabase
          .from('trips')
          .select('*')
          .eq('driver_id', currentUserProfile.id)
          .order('created_at', { ascending: false });
        setUserTrips(trips || []);
      }

      // Fetch user's bookings (if passenger)
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          trips (
            from_location,
            to_location,
            departure_time,
            price_per_seat
          )
        `)
        .eq('passenger_id', currentUserProfile.id)
        .order('created_at', { ascending: false });
      setUserBookings(bookings || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUserProfile?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', currentUserProfile.id);

      if (error) throw error;

      toast.success('تم تحديث الملف الشخصي بنجاح');
      onOpenChange(false);
    } catch (error: any) {
      toast.error('خطأ في تحديث الملف الشخصي: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  if (!user || !currentUserProfile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            الملف الشخصي
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">المعلومات</TabsTrigger>
            <TabsTrigger value="trips">الرحلات</TabsTrigger>
            <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  معلومات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>التقييم:</span>
                  <Badge variant="secondary">
                    ⭐ {currentUserProfile.rating?.toFixed(1) || '0.0'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>تأكيد الهوية:</span>
                  <Badge variant={currentUserProfile.cin_verified ? "default" : "outline"}>
                    {currentUserProfile.cin_verified ? '✅ مؤكد' : '⏳ غير مؤكد'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="أحمد محمد"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usertype">نوع الحساب</Label>
                  <Select 
                    value={profileData.user_type} 
                    onValueChange={(value: 'driver' | 'passenger') => setProfileData({...profileData, user_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passenger">راكب</SelectItem>
                      <SelectItem value="driver">سائق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Select 
                    value={profileData.gender} 
                    onValueChange={(value: 'male' | 'female' | 'other') => setProfileData({...profileData, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ذكر</SelectItem>
                      <SelectItem value="female">أنثى</SelectItem>
                      <SelectItem value="other">آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateProfile} disabled={loading} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" className="flex-1">
                    <LogOut className="w-4 h-4 mr-2" />
                    تسجيل الخروج
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الرحلات المنشورة</CardTitle>
              </CardHeader>
              <CardContent>
                {userTrips.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    لم تقم بنشر أي رحلات حتى الآن
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userTrips.map((trip: any) => (
                      <div key={trip.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{trip.from_location} ← {trip.to_location}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(trip.departure_time).toLocaleDateString('ar-MA')}
                            </p>
                            <p className="text-sm">المقاعد المتاحة: {trip.available_seats}/{trip.total_seats}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">{trip.price_per_seat} درهم</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الحجوزات</CardTitle>
              </CardHeader>
              <CardContent>
                {userBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    لم تقم بأي حجوزات حتى الآن
                  </p>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {booking.trips?.from_location} ← {booking.trips?.to_location}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.trips?.departure_time && 
                                new Date(booking.trips.departure_time).toLocaleDateString('ar-MA')
                              }
                            </p>
                            <p className="text-sm">مقاعد محجوزة: {booking.seats_booked}</p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={
                                booking.status === 'confirmed' ? 'default' : 
                                booking.status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {booking.status === 'confirmed' ? 'مؤكد' : 
                               booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                            </Badge>
                            <p className="font-bold text-primary mt-1">
                              {booking.trips?.price_per_seat * booking.seats_booked} درهم
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}