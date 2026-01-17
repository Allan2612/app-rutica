import { supabase } from '@/lib/supabase/client';

export interface CategoryItem {
    id: string;
    name: string;
}

/**
 * Obtiene todas las categorías disponibles en el sistema
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
