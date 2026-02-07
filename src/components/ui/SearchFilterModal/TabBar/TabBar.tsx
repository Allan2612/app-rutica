import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Type, Grid3X3, MapPin } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import type { FilterTab } from '@/types/entities';
import { styles } from './styles';

interface TabConfig {
    id: FilterTab;
    label: string;
    icon: typeof Type;
}

const TABS: TabConfig[] = [
    { id: 'text', label: 'Nombre', icon: Type },
    { id: 'categories', label: 'Categorías', icon: Grid3X3 },
    { id: 'location', label: 'Ubicación', icon: MapPin },
];

interface TabBarProps {
    activeTab: FilterTab;
    onTabChange: (tab: FilterTab) => void;
    showLocationTab?: boolean;
}

export const TabBar = memo(function TabBar({
    activeTab,
    onTabChange,
    showLocationTab = true,
}: TabBarProps) {
    const colors = useThemedColors();

    const visibleTabs = showLocationTab
        ? TABS
        : TABS.filter((tab) => tab.id !== 'location');

    return (
        <View style={[styles.container, { borderBottomColor: colors.border.light }]}>
            {visibleTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                const textColor = isActive ? colors.primary[500] : colors.text.secondary;

                return (
                    <Pressable
                        key={tab.id}
                        style={styles.tab}
                        onPress={() => onTabChange(tab.id)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Icon size={16} color={textColor} />
                        <Text style={[styles.tabText, { color: textColor }]}>
                            {tab.label}
                        </Text>
                        {isActive && (
                            <View
                                style={[
                                    styles.activeIndicator,
                                    { backgroundColor: colors.primary[500] },
                                ]}
                            />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
});
