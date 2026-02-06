/**
 * QuickActions Component
 * Feature tiles for quick navigation to main app sections
 */

import { memo, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Store, Calendar, MapPin, Tag, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface ActionItem {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    route: string;
    color: string;
    bgColor: string;
}

export const QuickActions = memo(function QuickActions() {
    console.log('[QuickActions] Rendering...');
    const colors = useThemedColors();
    const { width } = useWindowDimensions();

    const isMobile = width < 768;

    const actions: ActionItem[] = [
        {
            id: 'businesses',
            title: 'Negocios',
            subtitle: 'Encuentra lo que buscas',
            icon: Store,
            route: '/(app)/(tabs)/businesses',
            color: colors.isDark ? '#60a5fa' : '#2563eb',
            bgColor: colors.isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
        },
        {
            id: 'attractions',
            title: 'Atracciones',
            subtitle: 'Explora lugares únicos',
            icon: MapPin,
            route: '/(app)/(tabs)/attractions',
            color: colors.isDark ? '#34d399' : '#059669',
            bgColor: colors.isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
        },
        {
            id: 'events',
            title: 'Eventos',
            subtitle: 'Descubre actividades',
            icon: Calendar,
            route: '/(app)/(tabs)/attractions?tab=events',
            color: colors.isDark ? '#fbbf24' : '#d97706',
            bgColor: colors.isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)',
        },
        {
            id: 'promotions',
            title: 'Promociones',
            subtitle: 'Ahorra en grande',
            icon: Tag,
            route: '/(app)/(tabs)/businesses?tab=promotions',
            color: colors.isDark ? '#f472b6' : '#db2777',
            bgColor: colors.isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.1)',
        },
    ];

    const handlePress = useCallback((route: string) => {
        router.push(route as any);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Explora
            </Text>
            <View style={[styles.grid, isMobile && styles.gridMobile]}>
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Pressable
                            key={action.id}
                            style={({ pressed }) => [
                                styles.actionCard,
                                {
                                    backgroundColor: colors.background.secondary,
                                    borderColor: colors.border.light,
                                    transform: [{ scale: pressed ? 0.97 : 1 }],
                                },
                                isMobile && styles.actionCardMobile,
                            ]}
                            onPress={() => handlePress(action.route)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
                                <Icon size={24} color={action.color} strokeWidth={2} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                                    {action.title}
                                </Text>
                                <Text style={[styles.actionSubtitle, { color: colors.text.secondary }]}>
                                    {action.subtitle}
                                </Text>
                            </View>
                            <ChevronRight size={20} color={colors.primary[500]} strokeWidth={2.5} />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
});
