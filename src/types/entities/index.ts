// Profile
export type { Profile, ProfileInsert, ProfileUpdate } from './profile';
export { getFullName } from './profile';

// Category (Tabla central compartida)
export type {
  Category,
  CategoryItem,
  CategoryMap,
} from './category';
export { categoryToItem, categoriesToItems } from './category';

// Location
export type { 
  Location, 
  LocationInsert, 
  LocationUpdate,
  Province,
  Canton,
  District,
} from './location';

// Business
export type {
  Business,
  BusinessWithRelations,
  BusinessImage,
  BusinessSocialLink,
  BusinessInsert,
  BusinessUpdate,
  BusinessImageInsert,
  BusinessSocialLinkInsert,
} from './business';

// Product
export type {
  Product,
  ProductWithRelations,
  ProductImage,
  ProductCategoryMap,
  ProductInsert,
  ProductUpdate,
  ProductImageInsert,
} from './product';

// Attraction
export type {
  Attraction,
  AttractionWithRelations,
  AttractionImage,
  AttractionInsert,
  AttractionUpdate,
  AttractionImageInsert,
} from './attraction';

// Promotion
export type {
  Promotion,
  PromotionWithRelations,
  PromotionImage,
  PromotionImageInsert,
  PromotionProduct,
  PromotionProductInsert,
  PromotionCategory,
  PromotionCategoryInsert,
  PromotionComboItem,
  PromotionComboItemInsert,
  PromotionInsert,
  PromotionUpdate,
  PromotionListItem,
  PromotionDetailForEdit,
  CreatePromotionData,
  UpdatePromotionData,
  PromotionRecord,
  PromotionWizardFormData,
  PromotionWizardErrors,
  WizardStepId,
} from './promotion';

export { WIZARD_STEPS } from './promotion';

// Reviews
export type {
  BusinessReview,
  BusinessReviewWithRelations,
  ProductReview,
  ProductReviewWithRelations,
  AttractionReview,
  AttractionReviewWithRelations,
  BusinessReviewInsert,
  ProductReviewInsert,
  AttractionReviewInsert,
} from './review';

// Events
export type {
  Event,
  EventWithRelations,
  EventImage,
  EventReview,
  EventReviewWithRelations,
  EventInsert,
  EventImageInsert,
  EventReviewInsert,
  EventUpdate,
} from './event';
