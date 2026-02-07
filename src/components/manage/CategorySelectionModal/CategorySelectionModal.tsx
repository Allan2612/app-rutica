import React, { memo, useCallback, useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, SafeAreaView } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { CategoryFilterTab } from '@/components/ui/SearchFilterModal/CategoryFilterTab/CategoryFilterTab';
import type { HierarchicalCategoryOption } from '@/types/entities';
import { styles } from './styles';

export interface CategorySelectionModalProps {
    visible: boolean;
    categories: HierarchicalCategoryOption[];
    selectedIds: string[];
    onClose: () => void;
    onConfirm: (selectedIds: string[]) => void;
    title?: string;
}

export const CategorySelectionModal = memo(function CategorySelectionModal({
    visible,
    categories,
    selectedIds: initialSelectedIds,
    onClose,
    onConfirm,
    title = 'Seleccionar Categorías',
}: CategorySelectionModalProps) {
    const colors = useThemedColors();
    
    // Estado local temporal para la selección
    const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(initialSelectedIds);

    // Sincronizar cuando se abra el modal
    useEffect(() => {
        if (visible) {
            setTempSelectedIds(initialSelectedIds);
        }
    }, [visible, initialSelectedIds]);

    const handleConfirm = useCallback(() => {
        onConfirm(tempSelectedIds);
        onClose();
    }, [tempSelectedIds, onConfirm, onClose]);

    const handleCancel = useCallback(() => {
        setTempSelectedIds(initialSelectedIds); // Restaurar
        onClose();
    }, [initialSelectedIds, onClose]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleCancel}
        >
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    <View style={styles.headerLeft}>
                        <Pressable
                            onPress={handleCancel}
                            style={({ pressed }) => [
                                styles.closeButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                        >
                            <X size={24} color={colors.text.primary} />
                        </Pressable>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {title}
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleConfirm}
                        style={({ pressed }) => [
                            styles.confirmButton,
                            {
                                backgroundColor: colors.primary[500],
                                opacity: pressed ? 0.8 : 1,
                            },
                        ]}
                    >
                        <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </Pressable>
                </View>

                {/* Category Filter Tab */}
                <View style={styles.content}>
                    <CategoryFilterTab
                        categories={categories}
                        selectedIds={tempSelectedIds}
                        onChange={setTempSelectedIds}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
});
