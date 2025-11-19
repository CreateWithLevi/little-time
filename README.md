# Little Time ⏰

A beautiful, production-ready React Native mobile app for tracking time across multiple world timezones. Built with Expo and following strict iOS Human Interface Guidelines with Dark Mode support.

## Features

- **Custom Time Slider**: iOS Control Center-style slider with haptic feedback
- **Timeline View**: Horizontal bar chart showing 24 hours for each city
- **Card View**: Beautiful gradient cards displaying city time and status
- **Working Hours Detection**: Visual indicators for working hours (09:00-18:00)
- **City Search**: Searchable modal for adding cities from 15 pre-configured locations
- **Copy to Clipboard**: Quick copy all city times to clipboard
- **Strict Dark Mode**: Pure black background (#000000) following iOS guidelines
- **Haptic Feedback**: Tactile responses throughout the app

## Tech Stack

- **Expo SDK 52**
- **React Native 0.76.5**
- **expo-haptics**: Haptic feedback
- **expo-clipboard**: Clipboard functionality
- **expo-linear-gradient**: Gradient backgrounds
- **expo-blur**: Blur effects for modals
- **@expo/vector-icons**: Icon library

## Project Structure

```
/src
  /constants
    - Colors.js         # iOS Dark Mode color palette
    - CityData.js       # Database of 15 cities with IANA timezones
  /components
    - TimeSlider.js     # Custom touch slider with haptics
    - CityCard.js       # Card view component
    - TimelineRow.js    # Horizontal 24-hour timeline
    - SearchModal.js    # City selection modal
  /utils
    - TimeHelpers.js    # Timezone conversion utilities
  /screens
    - MainScreen.js     # Primary dashboard
App.js                  # Entry point with SafeAreaView
```

## Color Palette (iOS Dark Mode)

- **Background**: #000000 (Pure Black)
- **Surface**: #1C1C1E (Dark Gray)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #8E8E93
- **Accent**: #0A84FF (iOS Blue)
- **Success**: #30D158 (iOS Green - Working hours)
- **Separator**: #38383A

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the Expo development server
npm start
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Supported Cities

The app includes 15 pre-configured cities:

- 🇹🇼 台北 (Taipei)
- 🇯🇵 東京 (Tokyo)
- 🇺🇸 紐約 (New York)
- 🇬🇧 倫敦 (London)
- 🇫🇷 巴黎 (Paris)
- 🇩🇪 柏林 (Berlin)
- 🇦🇺 雪梨 (Sydney)
- 🇸🇬 新加坡 (Singapore)
- 🇭🇰 香港 (Hong Kong)
- 🇰🇷 首爾 (Seoul)
- 🇺🇸 洛杉磯 (Los Angeles)
- 🇺🇸 舊金山 (San Francisco)
- 🇨🇳 上海 (Shanghai)
- 🇦🇪 杜拜 (Dubai)
- 🇷🇺 莫斯科 (Moscow)

## Key Components

### TimeSlider
Custom iOS-style slider with PanResponder for smooth time scrubbing (0-23 hours).

### TimelineRow
Horizontal scrollable timeline showing 24 hour blocks:
- Green blocks: Working hours (09:00-18:00)
- Blue blocks: Selected hour
- White border: Current hour in that timezone

### CityCard
Alternative card view with:
- Gradient background for working hours
- Large time display
- Status badge (工作時間/非工作時間)

### SearchModal
iOS-style modal with:
- Blur overlay
- Real-time search
- Checkbox selection
- Traditional Chinese labels

## Development

The app is built with strict iOS Human Interface Guidelines:
- Pure black background for OLED displays
- System-standard colors
- Haptic feedback on all interactions
- Smooth animations and transitions
- SafeAreaView for notch compatibility

## License

MIT
