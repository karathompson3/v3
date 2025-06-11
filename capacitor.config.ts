
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.v3sparkwrapbuddy',
  appName: 'v3-spark-wrap-buddy',
  webDir: 'dist',
  server: {
    url: 'https://81ac9843-5cd6-45c2-9a62-7dfd2d5642f0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
