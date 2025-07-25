import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Car, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  DollarSign,
  Settings,
  Plus,
  X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const MOROCCAN_CITIES = [
  "الرباط", "الدار البيضاء", "فاس", "مراكش", "أكادير", "طنجة", 
  "مكناس", "وجدة", "تطوان", "الجديدة", "خريبكة", "القنيطرة"
];

const CAR_MODELS = [
  "تويوتا كامري", "رينو ميجان", "هيونداي i20", "بيجو 208", "سيات ليون",
  "فولكسفاجن جولف", "فورد فوكوس", "نيسان مايكرا", "شيفروليه أفيو"
];

const PREFERENCE_OPTIONS = [
  "غير مدخنين", "مكيف الهواء", "موسيقى", "صامت", "أمتعة كبيرة", "توقفات قليلة"
];

interface PostRideFormProps {
  onSubmit?: (rideData: any) => void;
}

export const PostRideForm = ({ onSubmit }: PostRideFormProps) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: undefined as Date | undefined,
    time: "",
    totalSeats: 1,
    pricePerSeat: "",
    carModel: "",
    carPlate: "",
    genderPreference: "any",
    preferences: [] as string[],
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.from || !formData.to || !formData.date || !formData.time || !formData.pricePerSeat) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إنشاء الرحلة بنجاح! سيتم مراجعتها قبل النشر.");
      onSubmit?.(formData);
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        from: "",
        to: "",
        date: undefined,
        time: "",
        totalSeats: 1,
        pricePerSeat: "",
        carModel: "",
        carPlate: "",
        genderPreference: "any",
        preferences: [],
        notes: ""
      });
    }, 1500);
  };

  const togglePreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground text-2xl">
          <Car className="w-6 h-6 text-primary" />
          إضافة رحلة جديدة
        </CardTitle>
        <p className="text-muted-foreground">
          شارك رحلتك مع الآخرين واربح أموالاً إضافية
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              معلومات المسار
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">من <span className="text-destructive">*</span></Label>
                <Select value={formData.from} onValueChange={(value) => setFormData(prev => ({ ...prev, from: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مدينة الانطلاق" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to">إلى <span className="text-destructive">*</span></Label>
                <Select value={formData.to} onValueChange={(value) => setFormData(prev => ({ ...prev, to: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مدينة الوصول" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              التاريخ والوقت
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>التاريخ <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "dd/MM/yyyy") : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">وقت المغادرة <span className="text-destructive">*</span></Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Car & Seats Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              معلومات السيارة والمقاعد
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carModel">نوع السيارة</Label>
                <Select value={formData.carModel} onValueChange={(value) => setFormData(prev => ({ ...prev, carModel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع السيارة" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_MODELS.map(model => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carPlate">رقم اللوحة (اختياري)</Label>
                <Input
                  id="carPlate"
                  placeholder="مثال: 12345 أ 1"
                  value={formData.carPlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, carPlate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalSeats">عدد المقاعد المتاحة <span className="text-destructive">*</span></Label>
                <Select 
                  value={formData.totalSeats.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, totalSeats: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {num} {num === 1 ? 'مقعد' : 'مقاعد'}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              التسعير
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="pricePerSeat">السعر لكل مقعد (MAD) <span className="text-destructive">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="pricePerSeat"
                  type="number"
                  placeholder="مثال: 150"
                  className="pl-10"
                  value={formData.pricePerSeat}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerSeat: e.target.value }))}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                السعر المقترح بناءً على المسافة: {formData.from && formData.to ? '120-180 MAD' : '---'}
              </p>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              التفضيلات
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>تفضيل الجنس</Label>
                <Select 
                  value={formData.genderPreference} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, genderPreference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">أي جنس</SelectItem>
                    <SelectItem value="men">رجال فقط</SelectItem>
                    <SelectItem value="women">نساء فقط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>التفضيلات الأخرى</Label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCE_OPTIONS.map(pref => (
                    <Badge
                      key={pref}
                      variant={formData.preferences.includes(pref) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => togglePreference(pref)}
                    >
                      {pref}
                      {formData.preferences.includes(pref) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="notes"
              placeholder="أي تفاصيل إضافية تريد مشاركتها مع الركاب..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              variant="moroccan" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري النشر...
                </div>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  نشر الرحلة
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};