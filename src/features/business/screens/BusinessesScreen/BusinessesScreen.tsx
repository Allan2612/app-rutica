import { memo, useMemo, useState } from 'react';
import { View, TextInput, ScrollView, Text, Pressable } from 'react-native';
import { TabSelector, TabOption, CategorySearchBar } from '@/components/ui';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { colors } from '@/styles/theme/colors';
import { styles } from './styles';

const BUSINESS_TABS: TabOption[] = [
    { id: 'commerces', label: 'Comercios' },
    { id: 'promotions', label: 'Promociones' },
];

export const BusinessesScreen = memo(function BusinessesScreen() {
    const [activeTab, setActiveTab] = useState('commerces');
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

    const { data: categories = [], isLoading } = useBusinessCategories();

    const toggleCategory = (id: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };


    return (
        <View style={styles.container}>
            {/* Category Search - solo para Comercios */}
            {activeTab === 'commerces' && (
                <CategorySearchBar
                    placeholder="Buscar comercios..."
                    categories={categories}
                    selectedCategoryIds={selectedCategoryIds}
                    onCategoryToggle={toggleCategory}
                    onSearchChange={setSearchText}
                    searchText={searchText}
                    isLoading={isLoading}
                />
            )}

            {/* Search simple para Promociones */}
            {activeTab === 'promotions' && (
                <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
                    <View style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        backgroundColor: '#fff',
                        paddingHorizontal: 12,
                    }}>
                        <TextInput
                            placeholder="Buscar promociones..."
                            value={searchText}
                            onChangeText={setSearchText}
                            style={{
                                paddingVertical: 10,
                                fontSize: 14,
                            }}
                        />
                    </View>
                </View>
            )}

            {/* Tabs debajo del search */}
            <TabSelector
                tabs={BUSINESS_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Contenido */}
            <View style={styles.content} />
        </View>
    );
});
