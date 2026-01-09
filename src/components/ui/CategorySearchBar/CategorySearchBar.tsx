import { memo, useState } from 'react';
import { View, TextInput, Pressable, ScrollView, Text } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { colors } from '@/styles/theme/colors';

export interface CategorySearchBarProps {
    placeholder: string;
    categories: Array<{ id: string; name: string }>;
    selectedCategoryIds: string[];
    onCategoryToggle: (id: string) => void;
    onSearchChange: (text: string) => void;
    searchText: string;
    isLoading?: boolean;
}

export const CategorySearchBar = memo(function CategorySearchBar({
    placeholder,
    categories,
    selectedCategoryIds,
    onCategoryToggle,
    onSearchChange,
    searchText,
    isLoading = false,
}: CategorySearchBarProps) {
    const [showFilters, setShowFilters] = useState(true);

    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
            {/* Search bar with dropdown toggle */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    paddingHorizontal: 12,
                    paddingVertical: 0,
                }}
            >
                <TextInput
                    placeholder={placeholder}
                    value={searchText}
                    onChangeText={onSearchChange}
                    style={{
                        flex: 1,
                        paddingVertical: 10,
                        fontSize: 14,
                    }}
                />
                <Pressable
                    onPress={() => setShowFilters(!showFilters)}
                    style={{
                        paddingHorizontal: 8,
                        paddingVertical: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {showFilters ? (
                        <ChevronUp size={18} color="#6b7280" />
                    ) : (
                        <ChevronDown size={18} color="#6b7280" />
                    )}
                </Pressable>
            </View>

            {/* Filter chips */}
            {showFilters && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 8 }}
                >
                    {(isLoading ? [] : categories).map((cat) => {
                        const selected = selectedCategoryIds.includes(cat.id);
                        return (
                            <Pressable
                                key={cat.id}
                                onPress={() => onCategoryToggle(cat.id)}
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderRadius: 999,
                                    borderWidth: 1,
                                    borderColor: selected ? colors.primary[500] : '#e5e7eb',
                                    backgroundColor: selected ? colors.primary[50] : '#fff',
                                    marginRight: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        color: selected ? colors.primary[700] : '#6b7280',
                                        fontSize: 12,
                                    }}
                                >
                                    {cat.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
});
