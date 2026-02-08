// ============================================
// Admin Module - Shared Types
// ============================================

import type { ModerationStatus, ImageType, PromotionScope } from '@/types/enums';

// ============================================
// Entity Types
// ============================================

export type VerificationEntityType = 'business' | 'event' | 'attraction' | 'promotion';

export type ReviewType = 'attraction' | 'business' | 'event' | 'product';

// ============================================
// Image Data
// ============================================

export interface ImageData {
  url: string;
  type?: ImageType;
  sortOrder?: number;
}

// ============================================
// Base Verification Request
// ============================================

export interface BaseVerificationRequest {
  id: string;
  type: VerificationEntityType;
  name: string;
  description: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  imageUrl: string | null;
  images: ImageData[];  // All images, not just primary
  moderationStatus: ModerationStatus;
  moderationNote: string | null;  // Existing moderation note
  isActive: boolean;
  createdAt: string;
  locationLabel: string | null;
}

// ============================================
// Entity-Specific Metadata
// ============================================

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface BusinessMetadata {
  phone: string | null;
  email: string | null;
  website: string | null;
  socialLinks: SocialLinks | null;
  categoriesNames: string[];
  avgRating: number;
  reviewsCount: number;
}

export interface EventMetadata {
  startAt: string | null;
  endAt: string | null;
  price: number | null;
  isFree: boolean;
  capacity: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  ticketUrl: string | null;
  socialLinks: SocialLinks | null;
  categoriesNames: string[];
  avgRating: number;
  reviewsCount: number;
}

export interface AttractionMetadata {
  categoriesNames: string[];
  avgRating: number;
  reviewsCount: number;
}

export interface PromotionMetadata {
  businessId: string;
  businessName: string | null;
  businessLocation: string | null;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number;
  scope: PromotionScope | null;
  startAt: string | null;
  endAt: string | null;
  moderationNote: string | null;
  categories: string[];
  promotionProducts: PromotionProduct[];
  comboItems: PromotionComboItem[];
  images: PromotionImageData[];
}

export interface PromotionProduct {
  productName: string;
  price: number | null;
}

export interface PromotionComboItem {
  productName: string;
  quantity: number;
  paidQuantity: number | null;
  price: number | null;
}

export interface PromotionImageData {
  type: string;
  url: string;
}

// ============================================
// Entity-Specific Verification Requests
// ============================================

export interface BusinessVerificationRequest extends BaseVerificationRequest {
  type: 'business';
  metadata: BusinessMetadata;
}

export interface EventVerificationRequest extends BaseVerificationRequest {
  type: 'event';
  metadata: EventMetadata;
}

export interface AttractionVerificationRequest extends BaseVerificationRequest {
  type: 'attraction';
  metadata: AttractionMetadata;
}

export interface PromotionVerificationRequest extends BaseVerificationRequest {
  type: 'promotion';
  businessId: string;
  metadata: PromotionMetadata;
}

// Union type
export type VerificationRequest =
  | BusinessVerificationRequest
  | EventVerificationRequest
  | AttractionVerificationRequest
  | PromotionVerificationRequest;

// ============================================
// Filter & Stats Types
// ============================================

export interface VerificationFilters {
  type?: VerificationEntityType | 'all';
  status?: ModerationStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface VerificationStats {
  totalPending: number;
  pendingByType: {
    business: number;
    event: number;
    attraction: number;
    promotion: number;
  };
}

// ============================================
// Update Types
// ============================================

export interface UpdateModerationData {
  id: string;
  type: VerificationEntityType;
  status?: ModerationStatus;
  note?: string;
  isActive?: boolean;
}

// ============================================
// UI Labels
// ============================================

export const TYPE_LABELS: Record<VerificationEntityType, string> = {
  business: 'Negocio',
  event: 'Evento',
  attraction: 'Atracción',
  promotion: 'Promoción',
};

export const TYPE_LABELS_FULL: Record<VerificationEntityType, string> = {
  business: 'el negocio',
  event: 'el evento',
  attraction: 'la atracción',
  promotion: 'la promoción',
};

export const STATUS_LABELS: Record<ModerationStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

export const SCOPE_LABELS: Record<PromotionScope, string> = {
  all: 'Todo el negocio',
  products: 'Productos específicos',
  categories: 'Categorías específicas',
  combo: 'Combo de productos',
};

// ============================================
// Reviews Management
// ============================================

export interface ReviewFilters {
  type?: ReviewType;
  searchTerm?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: string;
  endDate?: string;
}

export interface AdminReviewDisplay {
  id: string;
  type: ReviewType;
  contentId: string;
  contentTitle: string;
  userId: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  attraction: 'Atracción',
  business: 'Negocio',
  event: 'Evento',
  product: 'Producto',
};

// Note: Colors are now defined in @/styles/theme/colors.ts under colors.reviewTypes
// Use colors.reviewTypes.attraction, colors.reviewTypes.business, etc.
