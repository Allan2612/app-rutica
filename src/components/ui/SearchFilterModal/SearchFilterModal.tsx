import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useLocationStore } from '@/store';
import type { 
    FilterTab, 
    SearchFilters,
    HierarchicalCategoryOption,
} from '@/types/entities';
import { styles } from './styles';
import { TabBar } from './TabBar';
import { TextFilterTab } from './TextFilterTab';
import { CategoryFilterTab } from './CategoryFilterTab';
import { LocationFilterTab } from './LocationFilterTab';
import { FooterActions } from './FooterActions';

/**
 * Props del SearchFilterModal
 */
export interface SearchFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: SearchFilters) => void;
    categories: HierarchicalCategoryOption[];
    initialSearchText?: string;
    initialCategoryIds?: string[];
    placeholder?: string;
    title?: string;
    showLocationTab?: boolean;
}

// Re-exportar tipos para mantener compatibilidad
export type { SearchFilters, HierarchicalCategoryOption };

/**
 * Modal de filtros de búsqueda con 3 tabs:
 * - Texto: búsqueda por nombre/descripción
 * - Categorías: filtro por categorías con toggle de subcategorías
 * - Ubicación: filtro por provincia/cantón/distrito
 */
export function SearchFilterModal({
    visible,
    onClose,
    onApply,
    categories,
    initialSearchText = '',
    initialCategoryIds = [],
    placeholder = 'Buscar...',
    title = 'Buscar y Filtrar',
    showLocationTab = true,
}: SearchFilterModalProps) {
    const colors = useThemedColors();
    const { location } = useLocationStore();
    
    // Tab activo
    const [activeTab, setActiveTab] = useState<FilterTab>('text');
    
    // Estados de filtros
    const [searchText, setSearchText] = useState(initialSearchText);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds);

    // Reset solo cuando se ABRE el modal (visible cambia a true)
    useEffect(() => {
        if (visible) {
            setSearchText(initialSearchText);
            setSelectedCategoryIds(initialCategoryIds);
            setActiveTab('text');
        }
        // Solo cuando visible cambia - no cuando cambian los valores iniciales mientras está abierto
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    // Convertir categorías planas a jerárquicas si es necesario
    const hierarchicalCategories = useMemo((): HierarchicalCategoryOption[] => {
        return categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            parentId: cat.parentId ?? null,
        }));
    }, [categories]);

    const handleApply = useCallback(() => {
        onApply({
            searchText: searchText.trim(),
            categoryIds: selectedCategoryIds,
            location: location ? {
                province: location.province,
                canton: location.canton,
                district: location.district,
            } : null,
        });
        onClose();
    }, [searchText, selectedCategoryIds, location, onApply, onClose]);

    const handleClear = useCallback(() => {
        setSearchText('');
        setSelectedCategoryIds([]);
    }, []);

    const hasFilters = useMemo(() => {
        return (
            searchText.trim() !== '' ||
            selectedCategoryIds.length > 0 ||
            Boolean(location?.province || location?.canton || location?.district)
        );
    }, [searchText, selectedCategoryIds, location]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'text':
                return (
                    <TextFilterTab
                        value={searchText}
                        onChange={setSearchText}
                        placeholder={placeholder}
                    />
                );
            case 'categories':
                return (
                    <CategoryFilterTab
                        categories={hierarchicalCategories}
                        selectedIds={selectedCategoryIds}
                        onChange={setSelectedCategoryIds}
                    />
                );
            case 'location':
                return <LocationFilterTab />;
            default:
                return null;
        }
    };

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

                    {/* Tab Bar */}
                    <TabBar
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        showLocationTab={showLocationTab}
                    />

                    {/* Tab Content */}
                    <View style={styles.body}>
                        {renderTabContent()}
                    </View>

                    {/* Footer Actions */}
                    <FooterActions
                        hasFilters={hasFilters}
                        onClear={handleClear}
                        onApply={handleApply}
                    />
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
