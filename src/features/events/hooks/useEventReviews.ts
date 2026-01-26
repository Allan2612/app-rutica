import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getEventReviews,
    getUserEventReview,
    createEventReview,
    updateEventReview,
    deleteEventReview,
    type EventReviewDisplay,
} from '@/services/eventReviews.service';

const EVENT_REVIEWS_KEY = 'event-reviews';
const USER_EVENT_REVIEW_KEY = 'user-event-review';

export function useEventReviews(eventId: string) {
    return useQuery<EventReviewDisplay[]>({
        queryKey: [EVENT_REVIEWS_KEY, eventId],
        queryFn: () => getEventReviews(eventId),
        enabled: !!eventId,
    });
}

export function useUserEventReview(eventId: string, userId: string | null) {
    return useQuery<EventReviewDisplay | null>({
        queryKey: [USER_EVENT_REVIEW_KEY, eventId, userId],
        queryFn: () => getUserEventReview(eventId, userId!),
        enabled: !!eventId && !!userId,
    });
}

export function useCreateEventReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            eventId,
            userId,
            rating,
            comment,
        }: {
            eventId: string;
            userId: string;
            rating: number;
            comment?: string;
        }) => createEventReview(eventId, userId, rating, comment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [EVENT_REVIEWS_KEY, variables.eventId] });
            queryClient.invalidateQueries({ queryKey: [USER_EVENT_REVIEW_KEY, variables.eventId, variables.userId] });
        },
    });
}

export function useUpdateEventReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reviewId,
            rating,
            comment,
            eventId,
            userId,
        }: {
            reviewId: string;
            rating: number;
            comment?: string;
            eventId: string;
            userId: string;
        }) => updateEventReview(reviewId, rating, comment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [EVENT_REVIEWS_KEY, variables.eventId] });
            queryClient.invalidateQueries({ queryKey: [USER_EVENT_REVIEW_KEY, variables.eventId, variables.userId] });
        },
    });
}

export function useDeleteEventReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            reviewId,
            eventId,
            userId,
        }: {
            reviewId: string;
            eventId: string;
            userId: string;
        }) => deleteEventReview(reviewId, eventId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [EVENT_REVIEWS_KEY, variables.eventId] });
            queryClient.invalidateQueries({ queryKey: [USER_EVENT_REVIEW_KEY, variables.eventId, variables.userId] });
        },
    });
}
