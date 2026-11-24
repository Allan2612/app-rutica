import { Stack } from 'expo-router';

export default function ManageLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="events" />
      <Stack.Screen name="attractions" />
      <Stack.Screen name="businesses" />
      <Stack.Screen name="promotions" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
