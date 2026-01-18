import { Stack } from 'expo-router';
import { useThemedColors } from '@/hooks';

export default function BusinessesLayout() {
    const colors = useThemedColors();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background.primary,
                },
                headerTintColor: colors.text.primary,
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="add"
                options={{
                    title: 'Agregar Negocio',
                    headerShown: false,
                    presentation: 'card',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
