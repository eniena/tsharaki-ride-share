# 📱 Tsharaki Mobile App Setup

## 🚀 Quick Start for Mobile Development

Tsharaki is now ready for cross-platform mobile deployment on Android and iOS using Capacitor!

## 📋 Prerequisites

- Node.js and npm installed
- For iOS: Mac with Xcode
- For Android: Android Studio

## 🔧 Mobile Deployment Steps

### 1. Export & Clone Project
1. Click "Export to Github" button in Lovable
2. Clone your repository locally:
```bash
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize Capacitor (Already Done!)
The project already includes Capacitor configuration in `capacitor.config.ts`

### 4. Add Mobile Platforms
```bash
# Add iOS platform (Mac only)
npx cap add ios

# Add Android platform  
npx cap add android
```

### 5. Build & Sync
```bash
# Build the web app
npm run build

# Sync with native platforms
npx cap sync
```

### 6. Run on Device/Emulator
```bash
# For Android
npx cap run android

# For iOS (Mac only)
npx cap run ios
```

## 📱 Mobile Features Included

✅ **Cross-platform compatibility** - Works on Android, iOS, and web
✅ **Responsive design** - Mobile-first UI optimized for touch
✅ **Emergency button** - Fixed position for quick access
✅ **Offline-ready structure** - Can be enhanced with PWA features
✅ **Native app feel** - Smooth animations and transitions
✅ **Arabic/French support** - RTL text support built-in

## 🎨 Mobile-Optimized Features

- **Touch-friendly buttons** - Large tap targets for mobile use
- **Swipe gestures ready** - Component structure supports gestures
- **Emergency access** - Always-visible emergency button
- **One-handed navigation** - Bottom navigation for easy reach
- **Fast loading** - Optimized image sizes and lazy loading

## 🔧 Configuration

The app is configured with:
- **App ID**: `app.lovable.b02c2a33c8d64149be36001eefc77da3`
- **App Name**: "Tsharaki - تشاركي"
- **Splash Screen**: Moroccan orange theme
- **Status Bar**: Dark content with orange background
- **Hot Reload**: Enabled for development

## 🚨 Important Notes

1. **Always run `npx cap sync`** after git pull or code changes
2. **iOS requires Mac** with Xcode for development
3. **Testing on real devices** recommended for location features
4. **Production builds** require proper signing certificates

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Lovable Mobile Guide](https://docs.lovable.dev)
- [Android Studio Setup](https://developer.android.com/studio)
- [Xcode Setup](https://developer.apple.com/xcode/)

## 🆘 Troubleshooting

**Build errors?**
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npx cap clean`
- Rebuild: `npm run build && npx cap sync`

**Can't run on device?**
- Check USB debugging (Android) or developer signing (iOS)
- Ensure device is connected and authorized
- Try running in emulator first

---

**Happy coding! 🚗💨**