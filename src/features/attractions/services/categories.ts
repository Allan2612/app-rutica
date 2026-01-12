import { supabase } from '@/lib/supabase/client';

export interface AttractionCategoryItem {
    id: string;
    name: string;
}

export async function getAttractionCategories(): Promise<AttractionCategoryItem[]> {
    const { data, error } = await supabase
        .from('attraction_categories')
        .select('id_aca, name_aca')
        .order('name_aca', { ascending: true });

    if (error) {
        console.error('[ATTRACTIONS] getAttractionCategories error', error);
        return [];
    }

    return (data ?? []).map((row: any) => ({ id: row.id_aca, name: row.name_aca }));
}
