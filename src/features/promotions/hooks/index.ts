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

export {
  // Public promotions hooks
  usePromotions,
  useBusinessActivePromotions,
  PROMOTIONS_PUBLIC_KEYS,
} from './usePromotions';

// Wizard Hook
export { useCreatePromotionWizard } from './useCreatePromotionWizard';
