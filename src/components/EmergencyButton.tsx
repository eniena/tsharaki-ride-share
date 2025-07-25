import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  Shield,
  Siren
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyButtonProps {
  currentLocation?: string;
  rideInfo?: {
    driverName: string;
    carModel: string;
    carPlate: string;
    route: string;
  };
}

export const EmergencyButton = ({ currentLocation, rideInfo }: EmergencyButtonProps) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEmergencyCall = () => {
    setIsEmergencyActive(true);
    setShowConfirmation(false);
    
    // Simulate emergency protocol activation
    toast.error("تم تفعيل بروتوكول الطوارئ! جاري الاتصال بالأرقام المسجلة...", {
      duration: 5000
    });
    
    // In a real app, this would:
    // 1. Call emergency contacts
    // 2. Share live location with authorities
    // 3. Send alerts to Tsharaki support team
    // 4. Potentially call local emergency services
    
    setTimeout(() => {
      toast.success("تم إرسال موقعك الحالي لجهات الاتصال الطارئة");
    }, 2000);
  };

  const emergencyContacts = [
    { name: "الشرطة", number: "19", icon: Shield },
    { name: "الإسعاف", number: "15", icon: Phone },
    { name: "دعم تشاركي", number: "+212 5 22 00 00 00", icon: Siren }
  ];

  return (
    <>
      {/* Emergency Button */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="lg"
            className={`fixed bottom-6 right-6 w-16 h-16 rounded-full z-50 shadow-glow ${
              isEmergencyActive ? 'animate-pulse bg-destructive' : ''
            }`}
          >
            <AlertTriangle className="w-8 h-8" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              تفعيل الطوارئ
            </DialogTitle>
            <DialogDescription>
              هل تواجه حالة طوارئ حقيقية؟ سيتم إبلاغ جهات الاتصال المسجلة فوراً.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Info */}
            {rideInfo && (
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1 text-sm">
                    <p><strong>السائق:</strong> {rideInfo.driverName}</p>
                    <p><strong>السيارة:</strong> {rideInfo.carModel} - {rideInfo.carPlate}</p>
                    <p><strong>المسار:</strong> {rideInfo.route}</p>
                    <p><strong>الموقع:</strong> {currentLocation || 'جاري تحديد الموقع...'}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Emergency Contacts */}
            <div className="space-y-2">
              <h4 className="font-medium text-card-foreground">جهات الاتصال الطارئة:</h4>
              <div className="grid gap-2">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                    <div className="flex items-center gap-2">
                      <contact.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{contact.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{contact.number}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleEmergencyCall}
                className="flex-1"
              >
                <Siren className="w-4 h-4 mr-2" />
                تفعيل الطوارئ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Emergency Status Display */}
      {isEmergencyActive && (
        <div className="fixed top-20 left-4 right-4 z-50">
          <Alert className="border-destructive bg-destructive/10">
            <Siren className="h-4 w-4 text-destructive animate-pulse" />
            <AlertDescription className="text-destructive font-medium">
              <div className="flex items-center justify-between">
                <span>حالة طوارئ نشطة - تم إرسال موقعك</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEmergencyActive(false)}
                  className="text-destructive border-destructive"
                >
                  إنهاء
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};