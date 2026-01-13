import { memo, useState } from 'react';
import { View, TextInput, Pressable, ScrollView, Text } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';

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
    const [showFilters, setShowFilters] = useState(false);
    const colors = useThemedColors();

    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
            {/* Search bar with dropdown toggle */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.border.medium,
                    borderRadius: 8,
                    backgroundColor: colors.background.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 0,
                }}
            >
                <TextInput
                    placeholder={placeholder}
                    value={searchText}
                    onChangeText={onSearchChange}
                    placeholderTextColor={colors.text.tertiary}
                    style={{
                        flex: 1,
                        paddingVertical: 10,
                        fontSize: 14,
                        color: colors.text.primary,
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
                        <ChevronUp size={18} color={colors.text.tertiary} />
                    ) : (
                        <ChevronDown size={18} color={colors.text.tertiary} />
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
                                    borderColor: selected ? colors.primary[500] : colors.border.light,
                                    backgroundColor: selected ? (colors.isDark ? colors.primary[900] : colors.primary[50]) : colors.background.primary,
                                    marginRight: 6,
                                }}
                            >
                                <Text
                                    style={{
                                        color: selected ? (colors.isDark ? colors.primary[200] : colors.primary[700]) : colors.text.tertiary,
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
