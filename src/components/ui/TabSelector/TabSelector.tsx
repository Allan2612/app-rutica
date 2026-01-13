import { memo, useCallback } from 'react';
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
}

export const TabSelector = memo(function TabSelector({
    tabs,
    activeTab,
    onTabChange
}: TabSelectorProps) {
    const colors = useThemedColors();
    
    const handleTabPress = useCallback((tabId: string) => {
        onTabChange(tabId);
    }, [onTabChange]);

    return (
        <View style={[styles.container, { borderBottomColor: colors.border.light }]}>
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
                            style={[
                                styles.tab,
                                isActive && { 
                                    backgroundColor: colors.isDark 
                                        ? 'rgba(16, 185, 129, 0.08)' 
                                        : 'rgba(16, 185, 129, 0.05)',
                                    borderRadius: 20,
                                    paddingHorizontal: 16,
                                }
                            ]}
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
    );
});
