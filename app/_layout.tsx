import MediaContextProvider from '~/providers/MediaProvider';
import '../global.css';

import { Stack } from 'expo-router';
import AuthContextProvider from '~/providers/AuthProvider';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
    <MediaContextProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="asset" options={{ 
        title: 'Asset',
        headerTransparent: true,
        headerTintColor: 'white',
        headerBlurEffect: 'light',
        headerBackTitleVisible: false,
         }} />
    </Stack>
    </MediaContextProvider>
    </AuthContextProvider>
  );
}
