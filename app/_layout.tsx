import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { queryClient } from '../src/lib/react-query/client';

export default function RootLayout() {
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
