import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    Pressable,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Search, X, Check } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles, webStyles } from './styles';

interface Category {
    id: string;
    name: string;
}

export interface SearchFilters {
    searchText: string;
    categoryIds: string[];
}

export interface SearchFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: SearchFilters) => void;
    categories: Category[];
    initialSearchText?: string;
    initialCategoryIds?: string[];
    placeholder?: string;
    title?: string;
}

export function SearchFilterModal({
    visible,
    onClose,
    onApply,
    categories,
    initialSearchText = '',
    initialCategoryIds = [],
    placeholder = 'Buscar...',
    title = 'Buscar y Filtrar',
}: SearchFilterModalProps) {
    const colors = useThemedColors();
    const [searchText, setSearchText] = useState(initialSearchText);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds);

    // Reset cuando cambian los valores iniciales
    useEffect(() => {
        if (visible) {
            setSearchText(initialSearchText);
            setSelectedCategoryIds(initialCategoryIds);
        }
    }, [visible, initialSearchText, initialCategoryIds]);

    const toggleCategory = (id: string) => {
        setSelectedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleApply = () => {
        onApply({
            searchText: searchText.trim(),
            categoryIds: selectedCategoryIds,
        });
        onClose();
    };

    const handleClear = () => {
        setSearchText('');
        setSelectedCategoryIds([]);
    };

    const hasFilters = searchText.trim() !== '' || selectedCategoryIds.length > 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {title}
                        </Text>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text.secondary} />
                        </Pressable>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchSection}>
                        <View style={[styles.searchInputContainer, { 
                            backgroundColor: colors.background.secondary,
                            borderColor: colors.border.medium,
                        }]}>
                            <Search size={20} color={colors.text.tertiary} />
                            <TextInput
                                placeholder={placeholder}
                                placeholderTextColor={colors.text.tertiary}
                                value={searchText}
                                onChangeText={setSearchText}
                                style={[
                                    styles.searchInput, 
                                    webStyles.searchInputWeb as object,
                                    { color: colors.text.primary }
                                ]}
                                autoFocus
                                returnKeyType="search"
                                onSubmitEditing={handleApply}
                            />
                            {searchText.length > 0 && (
                                <Pressable onPress={() => setSearchText('')}>
                                    <X size={18} color={colors.text.tertiary} />
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <View style={styles.categoriesSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                                Filtrar por categorías
                            </Text>
                            <ScrollView 
                                style={styles.categoriesScroll}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.categoriesGrid}>
                                    {categories.map((cat) => {
                                        const isSelected = selectedCategoryIds.includes(cat.id);
                                        return (
                                            <Pressable
                                                key={cat.id}
                                                onPress={() => toggleCategory(cat.id)}
                                                style={[
                                                    styles.categoryChip,
                                                    {
                                                        backgroundColor: isSelected
                                                            ? colors.primary[500]
                                                            : colors.background.secondary,
                                                        borderColor: isSelected
                                                            ? colors.primary[500]
                                                            : colors.border.medium,
                                                    },
                                                ]}
                                            >
                                                {isSelected && (
                                                    <Check size={14} color={colors.text.inverse} style={styles.categoryCheckIcon} />
                                                )}
                                                <Text
                                                    style={[
                                                        styles.categoryText,
                                                        {
                                                            color: isSelected
                                                                ? colors.text.inverse
                                                                : colors.text.primary,
                                                        },
                                                    ]}
                                                >
                                                    {cat.name}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Actions */}
                    <View style={[styles.actions, { borderTopColor: colors.border.light }]}>
                        {hasFilters && (
                            <Pressable
                                onPress={handleClear}
                                style={[styles.clearButton, { borderColor: colors.border.medium }]}
                            >
                                <Text style={[styles.clearButtonText, { color: colors.text.secondary }]}>
                                    Limpiar
                                </Text>
                            </Pressable>
                        )}
                        <Pressable
                            onPress={handleApply}
                            style={[styles.applyButton, { backgroundColor: colors.primary[500] }]}
                        >
                            <Text style={styles.applyButtonText}>
                                Aplicar Filtros
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
