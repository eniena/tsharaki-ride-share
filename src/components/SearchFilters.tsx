import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Filter, 
  Users, 
  Star,
  DollarSign,
  X,
  Search
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface SearchFiltersProps {
  onSearch?: (filters: SearchFilters) => void;
}

interface SearchFilters {
  from: string;
  to: string;
  date?: Date;
  passengers: number;
  maxPrice?: number;
  minRating?: number;
  genderPreference?: string;
  preferences: string[];
}

const MOROCCAN_CITIES = [
  "الرباط", "الدار البيضاء", "فاس", "مراكش", "أكادير", "طنجة", 
  "مكناس", "وجدة", "تطوان", "الجديدة", "خريبكة", "القنيطرة"
];

const PREFERENCE_OPTIONS = [
  "غير مدخنين", "مكيف الهواء", "موسيقى", "صامت", "أمتعة كبيرة", "توقفات قليلة"
];

export const SearchFilters = ({ onSearch }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    passengers: 1,
    preferences: []
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const togglePreference = (pref: string) => {
    setFilters(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <MapPin className="w-5 h-5 text-primary" />
          البحث عن رحلة
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>من</Label>
            <Select value={filters.from} onValueChange={(value) => setFilters(prev => ({ ...prev, from: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent>
                {MOROCCAN_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>إلى</Label>
            <Select value={filters.to} onValueChange={(value) => setFilters(prev => ({ ...prev, to: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الوجهة" />
              </SelectTrigger>
              <SelectContent>
                {MOROCCAN_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date & Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>التاريخ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "dd/MM/yyyy") : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => setFilters(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>عدد الركاب</Label>
            <Select 
              value={filters.passengers.toString()} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, passengers: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {num} {num === 1 ? 'راكب' : 'ركاب'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          <Filter className="w-4 h-4 mr-2" />
          {isExpanded ? 'إخفاء الفلاتر المتقدمة' : 'فلاتر متقدمة'}
        </Button>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الحد الأقصى للسعر (MAD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="مثال: 200"
                    className="pl-10"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>تقييم السائق الأدنى</Label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Select 
                    value={filters.minRating?.toString() || ''} 
                    onValueChange={(value) => setFilters(prev => ({ 
                      ...prev, 
                      minRating: value ? parseFloat(value) : undefined 
                    }))}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="أي تقييم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5+ نجوم</SelectItem>
                      <SelectItem value="4.0">4.0+ نجوم</SelectItem>
                      <SelectItem value="3.5">3.5+ نجوم</SelectItem>
                      <SelectItem value="3.0">3.0+ نجوم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>تفضيل الجنس</Label>
              <Select 
                value={filters.genderPreference || ''} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  genderPreference: value || undefined 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="أي جنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">أي جنس</SelectItem>
                  <SelectItem value="men">رجال فقط</SelectItem>
                  <SelectItem value="women">نساء فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>التفضيلات</Label>
              <div className="flex flex-wrap gap-2">
                {PREFERENCE_OPTIONS.map(pref => (
                  <Badge
                    key={pref}
                    variant={filters.preferences.includes(pref) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => togglePreference(pref)}
                  >
                    {pref}
                    {filters.preferences.includes(pref) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <Button 
          variant="moroccan" 
          size="lg" 
          onClick={handleSearch}
          className="w-full"
          disabled={!filters.from || !filters.to}
        >
          <Search className="w-4 h-4 mr-2" />
          البحث عن الرحلات
        </Button>
      </CardContent>
    </Card>
  );
};