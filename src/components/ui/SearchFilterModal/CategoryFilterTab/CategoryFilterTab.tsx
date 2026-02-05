import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, Switch, ScrollView, Pressable, Platform } from 'react-native';
import { useThemedColors } from '@/hooks';
import type { HierarchicalCategoryOption } from '@/types/entities';
import { CategorySearchBar } from './CategorySearchBar';
import { SelectedCategoryChipsRow } from './SelectedCategoryChipsRow';
import { CategoryRow } from './CategoryRow';
import { styles } from './styles';

interface CategoryFilterTabProps {
    categories: HierarchicalCategoryOption[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

export const CategoryFilterTab = memo(function CategoryFilterTab({
    categories,
    selectedIds,
    onChange,
}: CategoryFilterTabProps) {
    const colors = useThemedColors();
    const [searchText, setSearchText] = useState('');
    const [includeSubcategories, setIncludeSubcategories] = useState(false);
    
    // Estado: [gen1_id, gen2_id, gen3_id...]
    const [activePath, setActivePath] = useState<string[]>([]);

    // Mapa de categorías por ID
    const categoryById = useMemo(() => {
        const map = new Map<string, HierarchicalCategoryOption>();
        categories.forEach((cat) => map.set(cat.id, cat));
        return map;
    }, [categories]);

    // Mapa de parentId -> children
    const childrenByParentId = useMemo(() => {
        const map = new Map<string | null, HierarchicalCategoryOption[]>();
        categories.forEach((cat) => {
            const children = map.get(cat.parentId) || [];
            children.push(cat);
            map.set(cat.parentId, children);
        });
        return map;
    }, [categories]);

    // Primera generación (roots)
    const gen1Categories = useMemo(() => {
        return childrenByParentId.get(null) || [];
    }, [childrenByParentId]);

    // Segunda generación (hijos del seleccionado en gen1)
    const gen2Categories = useMemo(() => {
        if (activePath.length === 0) return [];
        return childrenByParentId.get(activePath[0]) || [];
    }, [activePath, childrenByParentId]);

    // Tercera generación (hijos del seleccionado en gen2)
    const gen3Categories = useMemo(() => {
        if (activePath.length < 2) return [];
        return childrenByParentId.get(activePath[1]) || [];
    }, [activePath, childrenByParentId]);

    // Cuarta generación (hijos del seleccionado en gen3)
    const gen4Categories = useMemo(() => {
        if (activePath.length < 3) return [];
        return childrenByParentId.get(activePath[2]) || [];
    }, [activePath, childrenByParentId]);

    // Filtrar por búsqueda
    const searchResults = useMemo(() => {
        if (!searchText.trim()) return [];
        const search = searchText.toLowerCase().trim();
        return categories.filter((cat) => cat.name.toLowerCase().includes(search));
    }, [categories, searchText]);

    // Seleccionar categoría en una generación (actualiza activePath para navegación)
    const handleSelectInGen = useCallback((genIndex: number, categoryId: string) => {
        setActivePath((prev) => {
            const newPath = prev.slice(0, genIndex);
            newPath.push(categoryId);
            return newPath;
        });
    }, []);

    // Toggle selección (click simple para agregar/quitar del filtro)
    const handleToggleSelection = useCallback(
        (id: string) => {
            if (selectedIds.includes(id)) {
                onChange(selectedIds.filter((catId) => catId !== id));
            } else {
                onChange([...selectedIds, id]);
            }
        },
        [selectedIds, onChange]
    );

    // Remover una categoría
    const handleRemove = useCallback(
        (id: string) => {
            onChange(selectedIds.filter((catId) => catId !== id));
        },
        [selectedIds, onChange]
    );

    // Limpiar todas
    const handleClearAll = useCallback(() => {
        onChange([]);
    }, [onChange]);

    const isSearching = searchText.trim().length > 0;

    // Agregar estilos CSS personalizados para scrollbar en web
    useEffect(() => {
        if (Platform.OS === 'web') {
            const style = document.createElement('style');
            style.id = 'category-scrollbar-styles';
            style.textContent = `
                .category-scroll::-webkit-scrollbar {
                    height: 8px;
                }
                .category-scroll::-webkit-scrollbar-track {
                    background: ${colors.background.tertiary};
                    border-radius: 4px;
                    margin-left: 16px;
                    margin-right: 16px;
                }
                .category-scroll::-webkit-scrollbar-thumb {
                    background: ${colors.text.tertiary};
                    border-radius: 4px;
                }
                .category-scroll::-webkit-scrollbar-thumb:hover {
                    background: ${colors.text.secondary};
                }
            `;
            
            // Eliminar estilo anterior si existe
            const existingStyle = document.getElementById('category-scrollbar-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            document.head.appendChild(style);
            
            return () => {
                style.remove();
            };
        }
    }, [colors]);

    return (
        <View style={styles.container}>
            {/* 1. Search bar */}
            <CategorySearchBar value={searchText} onChange={setSearchText} />

            {/* 2. Chips seleccionadas */}
            <SelectedCategoryChipsRow
                selectedIds={selectedIds}
                categoryById={categoryById}
                onRemove={handleRemove}
                onClearAll={handleClearAll}
            />

            {isSearching ? (
                /* Resultados de búsqueda */
                <View style={styles.searchResults}>
                    <CategoryRow
                        title="Resultados de búsqueda"
                        categories={searchResults}
                        activeId={null}
                        selectedIds={selectedIds}
                        onSelect={(id) => {
                            // En búsqueda, solo seleccionar sin navegar
                            handleToggleSelection(id);
                        }}
                        onToggleSelection={handleToggleSelection}
                    />
                </View>
            ) : (
                <>
                    {/* 3. Toggle incluir hijas y botón limpiar */}
                    <View style={styles.toggleContainer}>
                        <View style={styles.toggleRow}>
                            <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>
                                Incluir subcategorías
                            </Text>
                            <Switch
                                value={includeSubcategories}
                                onValueChange={setIncludeSubcategories}
                                trackColor={{
                                    false: colors.border.medium,
                                    true: colors.primary[500],
                                }}
                                thumbColor={includeSubcategories ? colors.background.tertiary : colors.background.tertiary}
                                ios_backgroundColor={colors.border.medium}
                            />
                        </View>
                        {selectedIds.length > 0 && (
                            <Pressable 
                                onPress={handleClearAll}
                                style={({ pressed }) => [
                                    styles.clearAllButton,
                                    {
                                        backgroundColor: colors.background.secondary,
                                        opacity: pressed ? 0.7 : 1,
                                    },
                                ]}
                            >
                                <Text style={[styles.clearAllText, { color: colors.primary[500] }]}>
                                    Limpiar todo
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    {/* 4. Filas de categorías (se apilan verticalmente) */}
                    <ScrollView style={styles.generationsContainer}>
                        {/* Primera generación */}
                        <CategoryRow
                            title="Categorías principales"
                            categories={gen1Categories}
                            activeId={activePath[0] || null}
                            selectedIds={selectedIds}
                            onSelect={(id) => handleSelectInGen(0, id)}
                            onToggleSelection={handleToggleSelection}
                        />

                        {/* Segunda generación */}
                        {gen2Categories.length > 0 && (
                            <CategoryRow
                                title="Subcategorías"
                                categories={gen2Categories}
                                activeId={activePath[1] || null}
                                selectedIds={selectedIds}
                                onSelect={(id) => handleSelectInGen(1, id)}
                                onToggleSelection={handleToggleSelection}
                            />
                        )}

                        {/* Tercera generación */}
                        {gen3Categories.length > 0 && (
                            <CategoryRow
                                title="Especialidades"
                                categories={gen3Categories}
                                activeId={activePath[2] || null}
                                selectedIds={selectedIds}
                                onSelect={(id) => handleSelectInGen(2, id)}
                                onToggleSelection={handleToggleSelection}
                            />
                        )}

                        {/* Cuarta generación */}
                        {gen4Categories.length > 0 && (
                            <CategoryRow
                                title="Detalles"
                                categories={gen4Categories}
                                activeId={activePath[3] || null}
                                selectedIds={selectedIds}
                                onSelect={(id) => handleSelectInGen(3, id)}
                                onToggleSelection={handleToggleSelection}
                            />
                        )}
                    </ScrollView>
                </>
            )}
        </View>
    );
});
