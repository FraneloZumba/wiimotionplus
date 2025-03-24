import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.WiiMotionPlus.app',
  appName: 'WiiMotionPlus',
  webDir: 'dist/myapp/browser',
  server: {
    androidScheme: "https",
  },
  plugins: {
    Motion: {
      disableAccelerometer: false,
      disableGyroscope: false,
    },
  },
};

export default config;
