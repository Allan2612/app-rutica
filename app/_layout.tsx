import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { queryClient } from '../src/lib/react-query/client';
import { useDeepLinkHandler } from '../src/hooks/useDeepLinkHandler';

export default function RootLayout() {
  useDeepLinkHandler();

  useEffect(() => {
    console.log('[ROOT LAYOUT] Montado');
    return () => console.log('[ROOT LAYOUT] Desmontado');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
