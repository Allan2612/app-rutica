// ============================================
// Profile
// ============================================
export type {
  Profile,
  ProfilePremium,
  ProfileWithPremium,
  ProfileInsert,
  ProfileUpdate,
  ProfilePremiumInsert,
  Subscription,
  ProfileSubscription,
  ProfileSubscriptionInsert,
  ProfileWithSubscriptions,
  SubscriptionPlanInfo,
} from './profile';

export {
  getFullName,
  getInitials,
  canSell,
  isAdmin,
  isPremium,
  SUBSCRIPTION_PLANS,
  getSubscriptionPlanInfo,
  getSubscriptionTypeName,
} from './profile';

// ============================================
// Location (Normalized hierarchy)
// ============================================
export type {
  Country,
  Province,
  Canton,
  District,
  Location,
  LocationWithHierarchy,
  LocationInsert,
} from './location';

// ============================================
// Category
// ============================================
export type {
  Category,
  CategoryOption,
  BusinessCategoryMap,
  EventCategoryMap,
  AttractionCategoryMap,
  ProductCategoryMap,
  PromotionCategoryMap,
  HierarchicalCategoryOption,
} from './category';

export {
  categoryToOption,
  categoriesToOptions,
} from './category';

// ============================================
// Filter
// ============================================
export type {
  FilterTab,
  SearchFilters,
} from './filter';

// ============================================
// Business
// ============================================
export type {
  Business,
  BusinessImage,
  BusinessSocialLinks,
  BusinessWithRelations,
  BusinessInsert,
  BusinessUpdate,
  BusinessImageInsert,
  UserBusinessListItem,
  BusinessDetailForEdit,
  BusinessFormData,
} from './business';

export {
  getBusinessLogoUrl,
  getBusinessCoverUrl,
  getBusinessGalleryUrls,
  isBusinessPublic,
} from './business';

// ============================================
// Event
// ============================================
export type {
  Event,
  EventImage,
  EventSocialLinks,
  EventWithRelations,
  EventInsert,
  EventUpdate,
  EventImageInsert,
  UserEventListItem,
  EventDetailForEdit,
  EventFormData,
} from './event';

export {
  getEventCoverUrl,
  getEventGalleryUrls,
  isEventPublic,
  isEventPast,
  isEventOngoing,
} from './event';

// ============================================
// Attraction
// ============================================
export type {
  Attraction,
  AttractionImage,
  AttractionWithRelations,
  AttractionInsert,
  AttractionUpdate,
  AttractionImageInsert,
  UserAttractionListItem,
  AttractionDetailForEdit,
  AttractionFormData,
} from './attraction';

export {
  getAttractionCoverImageUrl,
  getAttractionGalleryUrls,
  isAttractionPublic,
} from './attraction';

// ============================================
// Product
// ============================================
export type {
  Product,
  ProductImage,
  ProductWithRelations,
  ProductInsert,
  ProductUpdate,
  ProductImageInsert,
  ProductListItem,
  ProductDetailForEdit,
  ProductFormData,
} from './product';

export {
  getProductMainImageUrl,
  getProductSecondaryImageUrls,
  getAllProductImageUrls,
} from './product';

// ============================================
// Promotion
// ============================================
export type {
  Promotion,
  PromotionImage,
  PromotionProduct,
  PromotionScopeCategory,
  PromotionComboItem,
  PromotionWithRelations,
  PromotionInsert,
  PromotionUpdate,
  PromotionImageInsert,
  PromotionProductInsert,
  PromotionScopeCategoryInsert,
  PromotionComboItemInsert,
  PromotionListItem,
  PromotionDetailForEdit,
  PromotionFormData,
  ComboItemData,
  PromotionWizardFormData,
  PromotionWizardErrors,
  WizardStepId,
} from './promotion';

export {
  WIZARD_STEPS,
  getPromotionCoverUrl,
  getPromotionGalleryUrls,
  isPromotionActive,
  isPromotionCurrent,
  isPromotionPublic,
  calculateDiscountedPrice,
} from './promotion';

// ============================================
// Reviews
// ============================================
export type {
  BusinessReview,
  BusinessReviewWithRelations,
  BusinessReviewInsert,
  EventReview,
  EventReviewWithRelations,
  EventReviewInsert,
  AttractionReview,
  AttractionReviewWithRelations,
  AttractionReviewInsert,
  ProductReview,
  ProductReviewWithRelations,
  ProductReviewInsert,
  ReviewListItem,
  ReviewFormData,
} from './review';

export {
  formatRating,
  getRatingLabel,
  calculateAverageRating,
} from './review';

// ============================================
// Likes
// ============================================
export type {
  EventLike,
  EventLikeWithRelations,
  AttractionLike,
  AttractionLikeWithRelations,
  BusinessLike,
  BusinessLikeWithRelations,
  EventReviewLike,
  EventReviewLikeWithRelations,
  AttractionReviewLike,
  AttractionReviewLikeWithRelations,
  BusinessReviewLike,
  BusinessReviewLikeWithRelations,
  ProductReviewLike,
  ProductReviewLikeWithRelations,
  EventLikeInsert,
  AttractionLikeInsert,
  BusinessLikeInsert,
  EventReviewLikeInsert,
  AttractionReviewLikeInsert,
  BusinessReviewLikeInsert,
  ProductReviewLikeInsert,
  LikeState,
  LikeToggleResult,
} from './like';

// ============================================
// Interactions
// ============================================
export type {
  BusinessInteraction,
  BusinessInteractionWithRelations,
  EventInteraction,
  EventInteractionWithRelations,
  AttractionInteraction,
  AttractionInteractionWithRelations,
  BusinessReviewInteraction,
  BusinessReviewInteractionWithRelations,
  EventReviewInteraction,
  EventReviewInteractionWithRelations,
  AttractionReviewInteraction,
  AttractionReviewInteractionWithRelations,
  ProductReviewInteraction,
  ProductReviewInteractionWithRelations,
  BusinessInteractionInsert,
  EventInteractionInsert,
  AttractionInteractionInsert,
  BusinessReviewInteractionInsert,
  EventReviewInteractionInsert,
  AttractionReviewInteractionInsert,
  ProductReviewInteractionInsert,
  InteractionStats,
  InteractionSummary,
} from './interaction';

export {
  isViewInteraction,
  isSocialInteraction,
  isContactInteraction,
  getInteractionLabel,
} from './interaction';

// ============================================
// Subscription Usage
// ============================================
export type {
  SubscriptionUsage,
  SubscriptionUsageInsert,
  SubscriptionUsageUpdate,
  QuotaInfo,
  ResourceLimits,
} from './subscription';

export {
  DEFAULT_RESOURCE_LIMITS,
  RESOURCE_TO_SUBSCRIPTION,
  getAvailableQuota,
  canAddResource,
  getQuotaMessage,
} from './subscription';
