import { supabase } from '@/lib/supabase/client';

export interface BusinessCategoryItem {
    id: string;
    name: string;
}

export async function getBusinessCategories(): Promise<BusinessCategoryItem[]> {
    const { data, error } = await supabase
        .from('business_category_map')
        .select('id_bca, name_bca')
        .order('name_bca', { ascending: true });

    if (error) {
        console.error('[BUSINESS] getBusinessCategories error', error);
        return [];
    }

    return (data ?? []).map((row: any) => ({ id: row.id_bca, name: row.name_bca }));
}
