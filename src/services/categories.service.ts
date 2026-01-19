import { supabase } from '@/lib/supabase/client';
import { Category, CategoryItem, categoryToItem } from '@/types/entities';

/**
 * Servicio centralizado para gestión de categorías
 * Todas las entidades (business, events, attractions, products, promotions) 
 * usan la misma tabla 'categories'
 */

/**
 * Obtiene todas las categorías del sistema (versión transformada para UI)
 * @returns Array de CategoryItem con {id, name}
 */
export async function getCategories(): Promise<CategoryItem[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat')
        .order('name_cat', { ascending: true });

    if (error) {
        return [];
    }

    return (data ?? []).map((row: any) => ({
        id: row.id_cat,
        name: row.name_cat,
    }));
}

/**
 * Obtiene todas las categorías (formato raw de BD)
 * @returns Array de Category con {id_cat, name_cat}
 */
export async function getCategoriesRaw(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat, created_at_cat')
        .order('name_cat', { ascending: true });

    if (error) {
        return [];
    }

    return data ?? [];
}

/**
 * Obtiene una categoría por ID
 */
export async function getCategoryById(id: string): Promise<CategoryItem | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat')
        .eq('id_cat', id)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id_cat,
        name: data.name_cat,
    };
}

/**
 * Busca categorías por nombre
 */
export async function searchCategories(searchTerm: string): Promise<CategoryItem[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat')
        .ilike('name_cat', `%${searchTerm}%`)
        .order('name_cat', { ascending: true })
        .limit(20);

    if (error) {
        return [];
    }

    return (data ?? []).map((row: any) => ({
        id: row.id_cat,
        name: row.name_cat,
    }));
}
