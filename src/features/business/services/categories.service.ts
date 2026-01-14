import { supabase } from '@/lib/supabase/client';

export interface CategoryItem {
    id: string;
    name: string;
}

/**
 * Obtiene todas las categorías disponibles en el sistema
 */
export async function getCategories(): Promise<CategoryItem[]> {
    console.log('[CATEGORIES] Fetching categories...');

    // Intentar primero con la estructura esperada
    let { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat')
        .order('name_cat', { ascending: true });

    // Si falla, intentar con * para ver toda la estructura
    if (error) {
        console.log('[CATEGORIES] First attempt failed, trying with *');
        const testQuery = await supabase
            .from('categories')
            .select('*')
            .limit(1);

        console.log('[CATEGORIES] Test query result:', testQuery);
    }

    if (error) {
        console.error('[CATEGORIES] getCategories error:', error);
        console.error('[CATEGORIES] Error details:', JSON.stringify(error, null, 2));
        return [];
    }

    console.log('[CATEGORIES] Raw data received:', data);
    console.log('[CATEGORIES] Number of categories:', data?.length || 0);

    if (data && data.length > 0) {
        console.log('[CATEGORIES] First category structure:', JSON.stringify(data[0], null, 2));
    }

    const mapped = (data ?? []).map((row: any) => ({
        id: row.id_cat,
        name: row.name_cat,
    }));

    console.log('[CATEGORIES] Mapped categories:', mapped);

    return mapped;
}
