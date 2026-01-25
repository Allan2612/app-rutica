// Promotions Hooks - Export barrel file

export {
    // Query Keys
    PROMOTIONS_KEYS,
    // GET Hooks
    useUserPromotions,
    useBusinessPromotions,
    usePromotionById,
    // Mutation Hooks
    useCreatePromotion,
    useUpdatePromotion,
    useDeletePromotion,
} from './useUserPromotions';

// Wizard Hook
export { useCreatePromotionWizard } from './useCreatePromotionWizard';

// Public Promotions Hook
export { usePromotions, PROMOTIONS_PUBLIC_KEYS } from './usePromotions';
