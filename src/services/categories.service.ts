import { supabase } from '@/lib/supabase/client';
import { Category, CategoryOption } from '@/types/entities';
import type { Database } from '@/lib/supabase/database.types';

/**
 * Servicio centralizado para gestión de categorías
 * Todas las entidades (business, events, attractions, products, promotions) 
 * usan la misma tabla 'categories'
 */

type CategoryRow = Database['public']['Tables']['categories']['Row'];

/**
 * Obtiene todas las categorías del sistema (versión transformada para UI)
 * @returns Array de CategoryOption con {id, name, parentId}
 */
export async function getCategories(): Promise<CategoryOption[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat, parent_id_cat')
        .eq('is_active_cat', true)
        .order('sort_order_cat', { ascending: true });

    if (error) {
        return [];
    }

    return ((data as unknown as CategoryRow[]) ?? []).map((row) => ({
        id: row.id_cat,
        name: row.name_cat,
        parentId: row.parent_id_cat,
    }));
}

/**
 * Obtiene todas las categorías (formato raw de BD)
 * @returns Array de Category con todos los campos
 */
export async function getCategoriesRaw(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active_cat', true)
        .order('sort_order_cat', { ascending: true });

    if (error) {
        return [];
    }

    return data ?? [];
}

/**
 * Obtiene una categoría por ID
 */
export async function getCategoryById(id: string): Promise<CategoryOption | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat, parent_id_cat')
        .eq('id_cat', id)
        .single();

    if (error || !data) {
        return null;
    }

    const category = data as unknown as CategoryRow;
    return {
        id: category.id_cat,
        name: category.name_cat,
        parentId: category.parent_id_cat,
    };
}

/**
 * Busca categorías por nombre
 */
export async function searchCategories(searchTerm: string): Promise<CategoryOption[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat, parent_id_cat')
        .ilike('name_cat', `%${searchTerm}%`)
        .order('name_cat', { ascending: true })
        .limit(20);

    if (error) {
        return [];
    }

    return ((data as unknown as CategoryRow[]) ?? []).map((row) => ({
        id: row.id_cat,
        name: row.name_cat,
        parentId: row.parent_id_cat,
    }));
}
