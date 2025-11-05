# SaveTheFridge - Virtual Fridge App 🥬

A modern, responsive web application to track food expiration dates and reduce food waste. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- 📷 **Barcode Scanning** - Scan product barcodes using your device camera
- 📦 **Product Database** - Automatic product information from Open Food Facts API
- ⏰ **Expiration Tracking** - Visual indicators for product freshness
- 🔔 **Smart Reminders** - Get notified before products expire
- 💾 **Local Storage** - All data saved locally on your device
- 📱 **Mobile-First Design** - Optimized for smartphone use
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Converting to Native Android App

1. Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init SaveTheFridge com.savethefridge.app --web-dir=dist
```

2. Add Android platform:
```bash
npx cap add android
```

3. Build and sync:
```bash
npm run build
npx cap sync
npx cap open android
```

## 🛠️ Tech Stack

- React 18 + Vite
- Tailwind CSS
- html5-qrcode
- Lucide React Icons
- Open Food Facts API

---

Made with ❤️ for reducing food waste
