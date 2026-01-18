import { Stack } from 'expo-router';
import { useThemedColors } from '@/hooks';

export default function AttractionsLayout() {
    const colors = useThemedColors();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.background.primary,
                },
                headerTintColor: colors.text.primary,
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: colors.background.secondary,
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Mis Atracciones',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="add"
                options={{
                    title: 'Crear Atracción',
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
