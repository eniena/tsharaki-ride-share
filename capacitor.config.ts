import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b02c2a33c8d64149be36001eefc77da3',
  appName: 'Tsharaki - تشاركي',
  webDir: 'dist',
  server: {
    url: 'https://b02c2a33-c8d6-4149-be36-001eefc77da3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#D97B4F",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#D97B4F'
    }
  }
};

export default config;