import { memo, useCallback, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

export interface TabOption {
    id: string;
    label: string;
}

export interface TabSelectorProps {
    tabs: TabOption[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    rightElement?: ReactNode;
}

export const TabSelector = memo(function TabSelector({
    tabs,
    activeTab,
    onTabChange,
    rightElement,
}: TabSelectorProps) {
    const colors = useThemedColors();
    
    const handleTabPress = useCallback((tabId: string) => {
        onTabChange(tabId);
    }, [onTabChange]);

    return (
        <View style={[styles.wrapper, { borderBottomColor: colors.border.light }]}>
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeTab;

                        return (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => handleTabPress(tab.id)}
                                style={styles.tab}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { 
                                        color: isActive 
                                            ? colors.primary[500] 
                                            : colors.text.secondary,
                                        textShadowColor: isActive 
                                            ? colors.isDark 
                                                ? 'rgba(16, 185, 129, 0.4)' 
                                                : 'rgba(16, 185, 129, 0.15)'
                                            : 'transparent',
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: isActive ? 8 : 0,
                                    },
                                    isActive && { fontWeight: '700' }
                                ]}>
                                    {tab.label}
                                </Text>

                                {isActive && (
                                    <View 
                                        style={[
                                            styles.indicator, 
                                            { backgroundColor: colors.primary[500] }
                                        ]} 
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            {rightElement && (
                <View style={styles.rightElement}>
                    {rightElement}
                </View>
            )}
        </View>
    );
});
