import { supabase } from '@/lib/supabase/client';

export interface BusinessCategoryItem {
    id: string;
    name: string;
}

export async function getBusinessCategories(): Promise<BusinessCategoryItem[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('id_cat, name_cat')
        .order('name_cat', { ascending: true });

    if (error) {
        console.error('[BUSINESS] getBusinessCategories error', error);
        return [];
    }

    return (data ?? []).map((row: any) => ({ id: row.id_cat, name: row.name_cat }));
}
