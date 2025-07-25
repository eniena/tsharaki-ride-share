import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Search, 
  User, 
  Bell, 
  Menu,
  MapPin,
  Plus
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  currentUser?: {
    name: string;
    avatar?: string;
    userType: 'driver' | 'passenger';
  };
  onMenuClick?: () => void;
}

export const Navigation = ({ currentUser, onMenuClick }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState<'search' | 'post' | 'profile'>('search');

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-moroccan rounded-lg flex items-center justify-center shadow-warm">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">تشاركي</h1>
              <p className="text-xs text-muted-foreground">Tsharaki</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary">
                3
              </Badge>
            </Button>
            
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentUser.userType === 'driver' ? 'سائق' : 'راكب'}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Button variant="moroccan" size="sm">
                تسجيل الدخول
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-center pb-3">
          <div className="bg-secondary/50 rounded-full p-1 flex gap-1">
            <Button
              variant={activeTab === 'search' ? 'moroccan' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('search')}
              className="rounded-full"
            >
              <Search className="w-4 h-4 mr-2" />
              البحث عن رحلة
            </Button>
            
            <Button
              variant={activeTab === 'post' ? 'moroccan' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('post')}
              className="rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة رحلة
            </Button>
            
            <Button
              variant={activeTab === 'profile' ? 'moroccan' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('profile')}
              className="rounded-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              رحلاتي
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};