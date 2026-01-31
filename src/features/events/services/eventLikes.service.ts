import { supabase } from '@/lib/supabase/client';

/**
 * Obtiene los IDs de los eventos a los que el usuario ha dado like
 */
export async function getUserLikedEventIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('event_likes')
        .select('event_id_elk')
        .eq('user_id_elk', userId);

    if (error) {
        console.error('[eventLikes] Error fetching user liked events:', error.message);
        return [];
    }

    return data.map((item: any) => item.event_id_elk);
}

/**
 * Verifica si el usuario ha dado like a un evento específico
 */
export async function isEventLikedByUser(eventId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('event_likes')
        .select('event_id_elk')
        .eq('event_id_elk', eventId)
        .eq('user_id_elk', userId)
        .single();

    if (error) {
        return false;
    }

    return !!data;
}

/**
 * Da like a un evento
 */
export async function addEventLike(eventId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('event_likes')
        .insert({
            event_id_elk: eventId,
            user_id_elk: userId,
        });

    if (error) {
        console.error('[eventLikes] Error adding like:', error.message);
        return false;
    }

    return true;
}

/**
 * Quita el like de un evento
 */
export async function removeEventLike(eventId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('event_likes')
        .delete()
        .eq('event_id_elk', eventId)
        .eq('user_id_elk', userId);

    if (error) {
        console.error('[eventLikes] Error removing like:', error.message);
        return false;
    }

    return true;
}

/**
 * Toggle like en un evento (agrega si no existe, quita si existe)
 */
export async function toggleEventLike(eventId: string, userId: string): Promise<boolean> {
    const isLiked = await isEventLikedByUser(eventId, userId);

    if (isLiked) {
        return await removeEventLike(eventId, userId);
    } else {
        return await addEventLike(eventId, userId);
    }
}

/**
 * Obtiene el conteo de likes de un evento
 */
export async function getEventLikesCount(eventId: string): Promise<number> {
    const { count, error } = await supabase
        .from('event_likes')
        .select('*', { count: 'exact', head: true })
        .eq('event_id_elk', eventId);

    if (error) {
        console.error('[eventLikes] Error counting likes:', error.message);
        return 0;
    }

    return count ?? 0;
}
