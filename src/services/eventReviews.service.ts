import { supabase } from '@/lib/supabase/client';
import { validateReviewContent } from './contentModeration.service';
import type { Database } from '@/lib/supabase/database.types';

export interface EventReviewDisplay {
    id: string;
    eventId: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    authorName: string;
}

type EventReviewRow = Database['public']['Tables']['event_reviews']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type EventReviewWithProfile = EventReviewRow & {
    profiles: Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
};

export async function getEventReviews(eventId: string): Promise<EventReviewDisplay[]> {
    const { data, error } = await supabase
        .from('event_reviews')
        .select(`
            id_erv,
            event_id_erv,
            user_id_erv,
            rating_erv,
            comment_erv,
            created_at_erv,
            profiles (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('event_id_erv', eventId)
        .order('created_at_erv', { ascending: false });

    if (error) {
        console.error('Error fetching event reviews:', error);
        return [];
    }

    return ((data as unknown as EventReviewWithProfile[]) ?? []).map((review) => {
        const profile = review.profiles;
        const firstName = profile?.first_name_prf ?? '';
        const lastName = profile?.last_name1_prf ?? '';
        const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

        return {
            id: review.id_erv,
            eventId: review.event_id_erv ?? '',
            userId: review.user_id_erv ?? '',
            rating: review.rating_erv ?? 0,
            comment: review.comment_erv,
            createdAt: review.created_at_erv,
            authorName,
        };
    });
}

export async function getUserEventReview(
    eventId: string,
    userId: string
): Promise<EventReviewDisplay | null> {
    const { data, error } = await supabase
        .from('event_reviews')
        .select(`
            id_erv,
            event_id_erv,
            user_id_erv,
            rating_erv,
            comment_erv,
            created_at_erv,
            profiles (
                first_name_prf,
                last_name1_prf
            )
        `)
        .eq('event_id_erv', eventId)
        .eq('user_id_erv', userId)
        .single();

    if (error || !data) return null;

    const review = data as unknown as EventReviewWithProfile;
    const profile = review.profiles;
    const firstName = profile?.first_name_prf ?? '';
    const lastName = profile?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_erv,
        eventId: review.event_id_erv ?? '',
        userId: review.user_id_erv ?? '',
        rating: review.rating_erv ?? 0,
        comment: review.comment_erv,
        createdAt: review.created_at_erv,
        authorName,
    };
}

export async function createEventReview(
    eventId: string,
    userId: string,
    rating: number,
    comment?: string
): Promise<EventReviewDisplay | null> {
    // Validar contenido antes de crear
    if (comment) {
        validateReviewContent(comment);
    }

    const { data, error } = await supabase
        .from('event_reviews')
        .insert({
            event_id_erv: eventId,
            user_id_erv: userId,
            rating_erv: rating,
            comment_erv: comment || null,
        } as any)
        .select(`id_erv, event_id_erv, user_id_erv, rating_erv, comment_erv, created_at_erv`)
        .single();

    if (error) {
        console.error('Error creating event review:', error);
        throw new Error(error.message);
    }

    const review = data as unknown as EventReviewRow;

    await updateEventRating(eventId);

    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', userId)
        .single();

    const profileData = profile as unknown as Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
    const firstName = profileData?.first_name_prf ?? '';
    const lastName = profileData?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_erv,
        eventId: review.event_id_erv ?? '',
        userId: review.user_id_erv ?? '',
        rating: review.rating_erv ?? 0,
        comment: review.comment_erv,
        createdAt: review.created_at_erv,
        authorName,
    };
}

export async function updateEventReview(
    reviewId: string,
    rating: number,
    comment?: string
): Promise<EventReviewDisplay | null> {
    // Validar contenido antes de actualizar
    if (comment) {
        validateReviewContent(comment);
    }

    const updatePayload: any = {
        rating_erv: rating,
        comment_erv: comment || null,
    };

    const { data, error } = await (supabase as any)
        .from('event_reviews')
        .update(updatePayload)
        .eq('id_erv', reviewId)
        .select(`id_erv, event_id_erv, user_id_erv, rating_erv, comment_erv, created_at_erv`)
        .single();

    if (error) {
        console.error('Error updating event review:', error);
        throw new Error(error.message);
    }

    const review = data as unknown as EventReviewRow;

    await updateEventRating(review.event_id_erv ?? '');

    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name_prf, last_name1_prf')
        .eq('id_prf', review.user_id_erv ?? '')
        .single();

    const profileData = profile as unknown as Pick<ProfileRow, 'first_name_prf' | 'last_name1_prf'> | null;
    const firstName = profileData?.first_name_prf ?? '';
    const lastName = profileData?.last_name1_prf ?? '';
    const authorName = [firstName, lastName].filter(Boolean).join(' ') || 'Usuario';

    return {
        id: review.id_erv,
        eventId: review.event_id_erv ?? '',
        userId: review.user_id_erv ?? '',
        rating: review.rating_erv ?? 0,
        comment: review.comment_erv,
        createdAt: review.created_at_erv,
        authorName,
    };
}

export async function deleteEventReview(reviewId: string, eventId: string): Promise<void> {
    const { error } = await supabase
        .from('event_reviews')
        .delete()
        .eq('id_erv', reviewId);

    if (error) {
        console.error('Error deleting event review:', error);
        throw new Error(error.message);
    }

    await updateEventRating(eventId);
}

async function updateEventRating(eventId: string): Promise<void> {
    const { data: reviews, error } = await supabase
        .from('event_reviews')
        .select('rating_erv')
        .eq('event_id_erv', eventId);

    if (error) {
        console.error('Error fetching reviews for rating update:', error);
        return;
    }

    const reviewsData = reviews as unknown as Pick<EventReviewRow, 'rating_erv'>[] | null;
    const reviewCount = reviewsData?.length ?? 0;
    const avgRating = reviewCount > 0
        ? reviewsData!.reduce((sum, r) => sum + (r.rating_erv ?? 0), 0) / reviewCount
        : 0;

    const updatePayload: any = {
        avg_rating_evt: Math.round(avgRating * 10) / 10,
        reviews_count_evt: reviewCount,
    };

    await (supabase as any)
        .from('events')
        .update(updatePayload)
        .eq('id_evt', eventId);
}
