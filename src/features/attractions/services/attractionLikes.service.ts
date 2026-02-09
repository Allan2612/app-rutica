import { supabase } from '@/lib/supabase/client';

/**
 * Obtiene los IDs de las atracciones a las que el usuario ha dado like
 */
export async function getUserLikedAttractionIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('attraction_likes')
        .select('attraction_id_alk')
        .eq('user_id_alk', userId);

    if (error) {
        console.error('[attractionLikes] Error fetching user liked attractions:', error.message);
        return [];
    }

    return data.map((item: any) => item.attraction_id_alk);
}

/**
 * Verifica si el usuario ha dado like a una atracción específica
 */
export async function isAttractionLikedByUser(attractionId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('attraction_likes')
        .select('attraction_id_alk')
        .eq('attraction_id_alk', attractionId)
        .eq('user_id_alk', userId)
        .single();

    if (error) {
        return false;
    }

    return !!data;
}

/**
 * Da like a una atracción
 */
export async function addAttractionLike(attractionId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('attraction_likes')
        .insert({
            attraction_id_alk: attractionId,
            user_id_alk: userId,
        } as any);

    if (error) {
        console.error('[attractionLikes] Error adding like:', error.message);
        return false;
    }

    return true;
}

/**
 * Quita el like de una atracción
 */
export async function removeAttractionLike(attractionId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('attraction_likes')
        .delete()
        .eq('attraction_id_alk', attractionId)
        .eq('user_id_alk', userId);

    if (error) {
        console.error('[attractionLikes] Error removing like:', error.message);
        return false;
    }

    return true;
}

/**
 * Toggle like en una atracción (agrega si no existe, quita si existe)
 */
export async function toggleAttractionLike(attractionId: string, userId: string): Promise<boolean> {
    const isLiked = await isAttractionLikedByUser(attractionId, userId);

    if (isLiked) {
        return await removeAttractionLike(attractionId, userId);
    } else {
        return await addAttractionLike(attractionId, userId);
    }
}

/**
 * Obtiene el conteo de likes de una atracción
 */
export async function getAttractionLikesCount(attractionId: string): Promise<number> {
    const { count, error } = await supabase
        .from('attraction_likes')
        .select('*', { count: 'exact', head: true })
        .eq('attraction_id_alk', attractionId);

    if (error) {
        console.error('[attractionLikes] Error counting likes:', error.message);
        return 0;
    }

    return count ?? 0;
}
