import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
    const handleTabPress = useCallback((tabId: string) => {
        onTabChange(tabId);
    }, [onTabChange]);

    return (
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
                                isActive && styles.tabTextActive
                            ]}>
                                {tab.label}
                            </Text>

                            {isActive && <View style={styles.indicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
});
