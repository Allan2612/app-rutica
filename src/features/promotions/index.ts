// Promotions Feature - Main Export barrel file

// Hooks
export {
    PROMOTIONS_KEYS,
    useUserPromotions,
    useBusinessPromotions,
    usePromotionById,
    useCreatePromotion,
    useUpdatePromotion,
    useDeletePromotion,
} from './hooks';

// Services
export {
    // Helpers
    generateUUID,
    getImageUrl,
    isNewImage,
    uploadPromotionImage,
    deletePromotionImage,
    extractPathFromUrl,
    // User Promotions
    getUserPromotions,
    getPromotionsByBusiness,
    getPromotionById,
    deleteUserPromotion,
    // Create
    createPromotionComplete,
    // Update
    updatePromotionComplete,
} from './services';
