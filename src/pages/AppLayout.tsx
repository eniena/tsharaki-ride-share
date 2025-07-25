import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { PostRideForm } from "@/components/PostRideForm";
import { UserProfile } from "@/components/UserProfile";
import { EmergencyButton } from "@/components/EmergencyButton";
import HomePage from "./HomePage";

type AppPage = 'home' | 'search' | 'post' | 'profile' | 'rides';

export default function AppLayout() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [currentUser] = useState({
    name: "محمد الأمين",
    avatar: "",
    userType: "passenger" as const
  });

  const [currentRide] = useState({
    driverName: "أحمد المزوغي",
    carModel: "تويوتا كامري 2022",
    carPlate: "12345 أ 1",
    route: "الرباط - الدار البيضاء"
  });

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
      case 'search':
        return <HomePage />;
      case 'post':
        return (
          <div className="min-h-screen bg-gradient-sunset py-8">
            <div className="container mx-auto px-4">
              <PostRideForm onSubmit={(data) => {
                console.log('New ride posted:', data);
                setCurrentPage('home');
              }} />
            </div>
          </div>
        );
      case 'profile':
      case 'rides':
        return (
          <div className="min-h-screen bg-gradient-sunset py-8">
            <div className="container mx-auto px-4">
              <UserProfile />
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sunset">
      <Navigation 
        currentUser={currentUser} 
        onMenuClick={() => {
          // Could open a sidebar menu here
          console.log('Menu clicked');
        }}
      />
      
      {/* Page Content */}
      <main className="relative">
        {renderPage()}
      </main>

      {/* Emergency Button - Always visible */}
      <EmergencyButton 
        currentLocation="الكيلومتر 45، طريق الرباط - الدار البيضاء"
        rideInfo={currentRide}
      />

      {/* Navigation Handler - In a real app, this would be handled by React Router */}
      <div className="fixed bottom-4 left-4 z-40 flex gap-2">
        {[
          { key: 'home', label: 'الرئيسية' },
          { key: 'post', label: 'إضافة رحلة' },
          { key: 'profile', label: 'الملف الشخصي' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key as AppPage)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              currentPage === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}