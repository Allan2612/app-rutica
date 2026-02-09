/**
 * Tipos generados para la base de datos de Supabase
 * Basado en el schema V3 con convención lowercase + sufijos
 */

import type {
  // Enums
  UserRole,
  ModerationStatus,
  PromotionScope,
  DiscountType,
  PaymentState,
  InteractionType,
} from '@/types/enums';

import type {
  // Entities
  Profile,
  ProfilePremium,
  Country,
  Province,
  Canton,
  District,
  Location,
  Category,
  BusinessCategoryMap,
  EventCategoryMap,
  AttractionCategoryMap,
  ProductCategoryMap,
  PromotionCategoryMap,
  Business,
  BusinessImage,
  Event,
  EventImage,
  Attraction,
  AttractionImage,
  Product,
  ProductImage,
  Promotion,
  PromotionImage,
  PromotionProduct,
  PromotionComboItem,
  PromotionScopeCategory,
  BusinessReview,
  EventReview,
  AttractionReview,
  ProductReview,
  BusinessLike,
  EventLike,
  AttractionLike,
  BusinessReviewLike,
  EventReviewLike,
  AttractionReviewLike,
  BusinessInteraction,
  EventInteraction,
  AttractionInteraction,
  BusinessReviewInteraction,
  EventReviewInteraction,
  AttractionReviewInteraction,
  ProductReviewInteraction,
} from '@/types/entities';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      // ============================================
      // Profiles
      // ============================================
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'is_active_prf' | 'created_at_prf' | 'updated_at_prf'> & {
          is_active_prf?: boolean;
          created_at_prf?: string;
          updated_at_prf?: string;
        };
        Update: Partial<Omit<Profile, 'id_prf' | 'created_at_prf' | 'updated_at_prf'>> & {
          updated_at_prf?: string;
        };
        Relationships: [];
      };
      profile_premium: {
        Row: ProfilePremium;
        Insert: Omit<ProfilePremium, 'subscribed_at_ppm' | 'created_at_ppm' | 'updated_at_ppm'> & {
          subscribed_at_ppm?: string;
          created_at_ppm?: string;
          updated_at_ppm?: string;
        };
        Update: Partial<
          Omit<ProfilePremium, 'profile_id_ppm' | 'created_at_ppm' | 'updated_at_ppm'>
        > & {
          updated_at_ppm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_premium_profile_id_fkey';
            columns: ['profile_id_ppm'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };

      // ============================================
      // Locations (Jerarquía normalizada)
      // ============================================
      countries: {
        Row: Country;
        Insert: Omit<Country, 'created_at_ctr'> & { created_at_ctr?: string };
        Update: Partial<Omit<Country, 'id_ctr' | 'created_at_ctr'>>;
        Relationships: [];
      };
      provinces: {
        Row: Province;
        Insert: Omit<Province, 'created_at_prv'> & { created_at_prv?: string };
        Update: Partial<Omit<Province, 'id_prv' | 'created_at_prv'>>;
        Relationships: [
          {
            foreignKeyName: 'provinces_country_id_fkey';
            columns: ['country_id_prv'];
            isOneToOne: false;
            referencedRelation: 'countries';
            referencedColumns: ['id_ctr'];
          },
        ];
      };
      cantons: {
        Row: Canton;
        Insert: Omit<Canton, 'created_at_ctn'> & { created_at_ctn?: string };
        Update: Partial<Omit<Canton, 'id_ctn' | 'created_at_ctn'>>;
        Relationships: [
          {
            foreignKeyName: 'cantons_province_id_fkey';
            columns: ['province_id_ctn'];
            isOneToOne: false;
            referencedRelation: 'provinces';
            referencedColumns: ['id_prv'];
          },
        ];
      };
      districts: {
        Row: District;
        Insert: Omit<District, 'created_at_dst'> & { created_at_dst?: string };
        Update: Partial<Omit<District, 'id_dst' | 'created_at_dst'>>;
        Relationships: [
          {
            foreignKeyName: 'districts_canton_id_fkey';
            columns: ['canton_id_dst'];
            isOneToOne: false;
            referencedRelation: 'cantons';
            referencedColumns: ['id_ctn'];
          },
        ];
      };
      locations: {
        Row: Location;
        Insert: Omit<Location, 'created_at_loc'> & { created_at_loc?: string };
        Update: Partial<Omit<Location, 'id_loc' | 'created_at_loc'>>;
        Relationships: [
          {
            foreignKeyName: 'locations_district_id_fkey';
            columns: ['district_id_loc'];
            isOneToOne: false;
            referencedRelation: 'districts';
            referencedColumns: ['id_dst'];
          },
        ];
      };

      // ============================================
      // Categories (Sistema compartido)
      // ============================================
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id_cat' | 'created_at_cat'> & {
          id_cat?: string;
          created_at_cat?: string;
        };
        Update: Partial<Omit<Category, 'id_cat' | 'created_at_cat'>>;
        Relationships: [];
      };
      business_category_map: {
        Row: BusinessCategoryMap;
        Insert: BusinessCategoryMap;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'business_category_map_business_id_bcm_fkey';
            columns: ['business_id_bcm'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_category_map_category_id_bcm_fkey';
            columns: ['category_id_bcm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      event_category_map: {
        Row: EventCategoryMap;
        Insert: EventCategoryMap;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'event_category_map_event_id_ecm_fkey';
            columns: ['event_id_ecm'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_category_map_category_id_ecm_fkey';
            columns: ['category_id_ecm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      attraction_category_map: {
        Row: AttractionCategoryMap;
        Insert: AttractionCategoryMap;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'attraction_category_map_attraction_id_acm_fkey';
            columns: ['attraction_id_acm'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_category_map_category_id_acm_fkey';
            columns: ['category_id_acm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      product_category_map: {
        Row: ProductCategoryMap;
        Insert: ProductCategoryMap;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'product_category_map_product_id_pcm_fkey';
            columns: ['product_id_pcm'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
          {
            foreignKeyName: 'product_category_map_category_id_pcm_fkey';
            columns: ['category_id_pcm'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };
      promotion_category_map: {
        Row: PromotionCategoryMap;
        Insert: PromotionCategoryMap;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'promotion_category_map_promotion_id_pcr_fkey';
            columns: ['promotion_id_pcr'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
          {
            foreignKeyName: 'promotion_category_map_category_id_pcr_fkey';
            columns: ['category_id_pcr'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };

      // ============================================
      // Business
      // ============================================
      businesses: {
        Row: Business;
        Insert: Omit<
          Business,
          | 'id_bus'
          | 'moderation_status_bus'
          | 'is_active_bus'
          | 'avg_rating_bus'
          | 'reviews_count_bus'
          | 'created_at_bus'
          | 'updated_at_bus'
        > & {
          id_bus?: string;
          moderation_status_bus?: ModerationStatus | null;
          is_active_bus?: boolean;
          avg_rating_bus?: number;
          reviews_count_bus?: number;
          created_at_bus?: string;
          updated_at_bus?: string;
        };
        Update: Partial<Omit<Business, 'id_bus' | 'created_at_bus' | 'updated_at_bus'>> & {
          updated_at_bus?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'businesses_owner_id_bus_fkey';
            columns: ['owner_id_bus'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'businesses_location_id_bus_fkey';
            columns: ['location_id_bus'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'businesses_reviewed_by_bus_fkey';
            columns: ['reviewed_by_bus'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_images: {
        Row: BusinessImage;
        Insert: Omit<BusinessImage, 'id_bim' | 'created_at_bim'> & {
          id_bim?: string;
          created_at_bim?: string;
        };
        Update: Partial<Omit<BusinessImage, 'id_bim' | 'business_id_bim' | 'created_at_bim'>>;
        Relationships: [
          {
            foreignKeyName: 'business_images_business_id_fkey';
            columns: ['business_id_bim'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
        ];
      };

      // ============================================
      // Events
      // ============================================
      events: {
        Row: Event;
        Insert: Omit<
          Event,
          | 'id_evt'
          | 'is_free_evt'
          | 'moderation_status_evt'
          | 'avg_rating_evt'
          | 'reviews_count_evt'
          | 'is_active_evt'
          | 'created_at_evt'
          | 'updated_at_evt'
        > & {
          id_evt?: string;
          is_free_evt?: boolean;
          moderation_status_evt?: ModerationStatus | null;
          avg_rating_evt?: number;
          reviews_count_evt?: number;
          is_active_evt?: boolean;
          created_at_evt?: string;
          updated_at_evt?: string;
        };
        Update: Partial<Omit<Event, 'id_evt' | 'created_at_evt' | 'updated_at_evt'>> & {
          updated_at_evt?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'events_created_by_evt_fkey';
            columns: ['created_by_evt'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'events_location_id_evt_fkey';
            columns: ['location_id_evt'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'events_reviewed_by_evt_fkey';
            columns: ['reviewed_by_evt'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_images: {
        Row: EventImage;
        Insert: Omit<EventImage, 'id_eim' | 'created_at_eim'> & {
          id_eim?: string;
          created_at_eim?: string;
        };
        Update: Partial<Omit<EventImage, 'id_eim' | 'event_id_eim' | 'created_at_eim'>>;
        Relationships: [
          {
            foreignKeyName: 'event_images_event_id_fkey';
            columns: ['event_id_eim'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
        ];
      };

      // ============================================
      // Attractions
      // ============================================
      attractions: {
        Row: Attraction;
        Insert: Omit<
          Attraction,
          | 'id_atr'
          | 'moderation_status_atr'
          | 'avg_rating_atr'
          | 'reviews_count_atr'
          | 'is_active_atr'
          | 'created_at_atr'
          | 'updated_at_atr'
        > & {
          id_atr?: string;
          moderation_status_atr?: ModerationStatus | null;
          avg_rating_atr?: number;
          reviews_count_atr?: number;
          is_active_atr?: boolean;
          created_at_atr?: string;
          updated_at_atr?: string;
        };
        Update: Partial<Omit<Attraction, 'id_atr' | 'created_at_atr' | 'updated_at_atr'>> & {
          updated_at_atr?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attractions_submitted_by_atr_fkey';
            columns: ['submitted_by_atr'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'attractions_location_id_atr_fkey';
            columns: ['location_id_atr'];
            isOneToOne: false;
            referencedRelation: 'locations';
            referencedColumns: ['id_loc'];
          },
          {
            foreignKeyName: 'attractions_reviewed_by_atr_fkey';
            columns: ['reviewed_by_atr'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_images: {
        Row: AttractionImage;
        Insert: Omit<AttractionImage, 'id_aim' | 'created_at_aim'> & {
          id_aim?: string;
          created_at_aim?: string;
        };
        Update: Partial<Omit<AttractionImage, 'id_aim' | 'attraction_id_aim' | 'created_at_aim'>>;
        Relationships: [
          {
            foreignKeyName: 'attraction_images_attraction_id_fkey';
            columns: ['attraction_id_aim'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
        ];
      };

      // ============================================
      // Products
      // ============================================
      products: {
        Row: Product;
        Insert: Omit<
          Product,
          | 'id_prd'
          | 'is_active_prd'
          | 'avg_rating_prd'
          | 'reviews_count_prd'
          | 'created_at_prd'
          | 'updated_at_prd'
        > & {
          id_prd?: string;
          is_active_prd?: boolean;
          avg_rating_prd?: number;
          reviews_count_prd?: number;
          created_at_prd?: string;
          updated_at_prd?: string;
        };
        Update: Partial<Omit<Product, 'id_prd' | 'created_at_prd' | 'updated_at_prd'>> & {
          updated_at_prd?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_business_id_prd_fkey';
            columns: ['business_id_prd'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
        ];
      };
      product_images: {
        Row: ProductImage;
        Insert: Omit<ProductImage, 'id_pim' | 'created_at_pim'> & {
          id_pim?: string;
          created_at_pim?: string;
        };
        Update: Partial<Omit<ProductImage, 'id_pim' | 'product_id_pim' | 'created_at_pim'>>;
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id_pim'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
        ];
      };

      // ============================================
      // Promotions
      // ============================================
      promotions: {
        Row: Promotion;
        Insert: Omit<
          Promotion,
          | 'id_prm'
          | 'moderation_status_prm'
          | 'payment_state_prm'
          | 'is_active_prm'
          | 'discount_value_prm'
          | 'created_at_prm'
          | 'updated_at_prm'
        > & {
          id_prm?: string;
          moderation_status_prm?: ModerationStatus | null;
          payment_state_prm?: PaymentState | null;
          is_active_prm?: boolean;
          discount_value_prm?: number;
          created_at_prm?: string;
          updated_at_prm?: string;
        };
        Update: Partial<Omit<Promotion, 'id_prm' | 'created_at_prm' | 'updated_at_prm'>> & {
          updated_at_prm?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'promotions_business_id_prm_fkey';
            columns: ['business_id_prm'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'promotions_created_by_prm_fkey';
            columns: ['created_by_prm'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
          {
            foreignKeyName: 'promotions_reviewed_by_prm_fkey';
            columns: ['reviewed_by_prm'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      promotion_images: {
        Row: PromotionImage;
        Insert: Omit<PromotionImage, 'id_pim' | 'created_at_pim'> & {
          id_pim?: string;
          created_at_pim?: string;
        };
        Update: Partial<Omit<PromotionImage, 'id_pim' | 'promotion_id_pim' | 'created_at_pim'>>;
        Relationships: [
          {
            foreignKeyName: 'promotion_images_promotion_id_fkey';
            columns: ['promotion_id_pim'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
        ];
      };
      promotion_combo_items: {
        Row: PromotionComboItem;
        Insert: Omit<PromotionComboItem, 'quantity_pci'> & {
          quantity_pci?: number;
        };
        Update: Partial<Omit<PromotionComboItem, 'promotion_id_pci' | 'product_id_pci'>>;
        Relationships: [
          {
            foreignKeyName: 'promotion_combo_items_promotion_id_pci_fkey';
            columns: ['promotion_id_pci'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
          {
            foreignKeyName: 'promotion_combo_items_product_id_pci_fkey';
            columns: ['product_id_pci'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
        ];
      };
      promotion_products: {
        Row: PromotionProduct;
        Insert: PromotionProduct;
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'promotion_products_promotion_id_ppr_fkey';
            columns: ['promotion_id_ppr'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
          {
            foreignKeyName: 'promotion_products_product_id_ppr_fkey';
            columns: ['product_id_ppr'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
        ];
      };
      promotion_scope_categories: {
        Row: PromotionScopeCategory;
        Insert: Omit<PromotionScopeCategory, 'created_at_psc'> & {
          created_at_psc?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'promotion_scope_categories_promotion_id_psc_fkey';
            columns: ['promotion_id_psc'];
            isOneToOne: false;
            referencedRelation: 'promotions';
            referencedColumns: ['id_prm'];
          },
          {
            foreignKeyName: 'promotion_scope_categories_category_id_psc_fkey';
            columns: ['category_id_psc'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id_cat'];
          },
        ];
      };

      // ============================================
      // Reviews
      // ============================================
      business_reviews: {
        Row: BusinessReview;
        Insert: Omit<BusinessReview, 'id_brv' | 'created_at_brv'> & {
          id_brv?: string;
          created_at_brv?: string;
        };
        Update: Partial<
          Omit<BusinessReview, 'id_brv' | 'business_id_brv' | 'user_id_brv' | 'created_at_brv'>
        >;
        Relationships: [
          {
            foreignKeyName: 'business_reviews_business_id_brv_fkey';
            columns: ['business_id_brv'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_reviews_user_id_brv_fkey';
            columns: ['user_id_brv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_reviews: {
        Row: EventReview;
        Insert: Omit<EventReview, 'id_erv' | 'created_at_erv'> & {
          id_erv?: string;
          created_at_erv?: string;
        };
        Update: Partial<
          Omit<EventReview, 'id_erv' | 'event_id_erv' | 'user_id_erv' | 'created_at_erv'>
        >;
        Relationships: [
          {
            foreignKeyName: 'event_reviews_event_id_erv_fkey';
            columns: ['event_id_erv'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_reviews_user_id_erv_fkey';
            columns: ['user_id_erv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_reviews: {
        Row: AttractionReview;
        Insert: Omit<AttractionReview, 'id_arv' | 'created_at_arv'> & {
          id_arv?: string;
          created_at_arv?: string;
        };
        Update: Partial<
          Omit<AttractionReview, 'id_arv' | 'attraction_id_arv' | 'user_id_arv' | 'created_at_arv'>
        >;
        Relationships: [
          {
            foreignKeyName: 'attraction_reviews_attraction_id_arv_fkey';
            columns: ['attraction_id_arv'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_reviews_user_id_arv_fkey';
            columns: ['user_id_arv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      product_reviews: {
        Row: ProductReview;
        Insert: Omit<ProductReview, 'id_prv' | 'created_at_prv'> & {
          id_prv?: string;
          created_at_prv?: string;
        };
        Update: Partial<
          Omit<ProductReview, 'id_prv' | 'product_id_prv' | 'user_id_prv' | 'created_at_prv'>
        >;
        Relationships: [
          {
            foreignKeyName: 'product_reviews_product_id_prv_fkey';
            columns: ['product_id_prv'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id_prd'];
          },
          {
            foreignKeyName: 'product_reviews_user_id_prv_fkey';
            columns: ['user_id_prv'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };

      // ============================================
      // Likes
      // ============================================
      business_likes: {
        Row: BusinessLike;
        Insert: Omit<BusinessLike, 'created_at_blk'> & { created_at_blk?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'business_likes_business_id_fkey';
            columns: ['business_id_blk'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_likes_user_id_fkey';
            columns: ['user_id_blk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_likes: {
        Row: EventLike;
        Insert: Omit<EventLike, 'created_at_elk'> & { created_at_elk?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'event_likes_event_id_fkey';
            columns: ['event_id_elk'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_likes_user_id_fkey';
            columns: ['user_id_elk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_likes: {
        Row: AttractionLike;
        Insert: Omit<AttractionLike, 'created_at_alk'> & { created_at_alk?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'attraction_likes_attraction_id_fkey';
            columns: ['attraction_id_alk'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_likes_user_id_fkey';
            columns: ['user_id_alk'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_review_likes: {
        Row: BusinessReviewLike;
        Insert: Omit<BusinessReviewLike, 'created_at_brl'> & { created_at_brl?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'business_review_likes_review_id_fkey';
            columns: ['review_id_brl'];
            isOneToOne: false;
            referencedRelation: 'business_reviews';
            referencedColumns: ['id_brv'];
          },
          {
            foreignKeyName: 'business_review_likes_user_id_fkey';
            columns: ['user_id_brl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_review_likes: {
        Row: EventReviewLike;
        Insert: Omit<EventReviewLike, 'created_at_erl'> & { created_at_erl?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'event_review_likes_review_id_fkey';
            columns: ['review_id_erl'];
            isOneToOne: false;
            referencedRelation: 'event_reviews';
            referencedColumns: ['id_erv'];
          },
          {
            foreignKeyName: 'event_review_likes_user_id_fkey';
            columns: ['user_id_erl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_review_likes: {
        Row: AttractionReviewLike;
        Insert: Omit<AttractionReviewLike, 'created_at_arl'> & { created_at_arl?: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'attraction_review_likes_review_id_fkey';
            columns: ['review_id_arl'];
            isOneToOne: false;
            referencedRelation: 'attraction_reviews';
            referencedColumns: ['id_arv'];
          },
          {
            foreignKeyName: 'attraction_review_likes_user_id_fkey';
            columns: ['user_id_arl'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };

      // ============================================
      // Interactions
      // ============================================
      business_interactions: {
        Row: BusinessInteraction;
        Insert: Omit<BusinessInteraction, 'id_bin' | 'created_at_bin'> & {
          id_bin?: string;
          created_at_bin?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'business_interactions_business_fkey';
            columns: ['business_id_bin'];
            isOneToOne: false;
            referencedRelation: 'businesses';
            referencedColumns: ['id_bus'];
          },
          {
            foreignKeyName: 'business_interactions_user_fkey';
            columns: ['user_id_bin'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_interactions: {
        Row: EventInteraction;
        Insert: Omit<EventInteraction, 'id_ein' | 'created_at_ein'> & {
          id_ein?: string;
          created_at_ein?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'event_interactions_event_fkey';
            columns: ['event_id_ein'];
            isOneToOne: false;
            referencedRelation: 'events';
            referencedColumns: ['id_evt'];
          },
          {
            foreignKeyName: 'event_interactions_user_fkey';
            columns: ['user_id_ein'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_interactions: {
        Row: AttractionInteraction;
        Insert: Omit<AttractionInteraction, 'id_ain' | 'created_at_ain'> & {
          id_ain?: string;
          created_at_ain?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'attraction_interactions_attraction_fkey';
            columns: ['attraction_id_ain'];
            isOneToOne: false;
            referencedRelation: 'attractions';
            referencedColumns: ['id_atr'];
          },
          {
            foreignKeyName: 'attraction_interactions_user_fkey';
            columns: ['user_id_ain'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      business_review_interactions: {
        Row: BusinessReviewInteraction;
        Insert: Omit<BusinessReviewInteraction, 'id_bri' | 'created_at_bri'> & {
          id_bri?: string;
          created_at_bri?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'business_review_interactions_review_fkey';
            columns: ['review_id_bri'];
            isOneToOne: false;
            referencedRelation: 'business_reviews';
            referencedColumns: ['id_brv'];
          },
          {
            foreignKeyName: 'business_review_interactions_user_fkey';
            columns: ['user_id_bri'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      event_review_interactions: {
        Row: EventReviewInteraction;
        Insert: Omit<EventReviewInteraction, 'id_eri' | 'created_at_eri'> & {
          id_eri?: string;
          created_at_eri?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'event_review_interactions_review_fkey';
            columns: ['review_id_eri'];
            isOneToOne: false;
            referencedRelation: 'event_reviews';
            referencedColumns: ['id_erv'];
          },
          {
            foreignKeyName: 'event_review_interactions_user_fkey';
            columns: ['user_id_eri'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      attraction_review_interactions: {
        Row: AttractionReviewInteraction;
        Insert: Omit<AttractionReviewInteraction, 'id_ari' | 'created_at_ari'> & {
          id_ari?: string;
          created_at_ari?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'attraction_review_interactions_review_fkey';
            columns: ['review_id_ari'];
            isOneToOne: false;
            referencedRelation: 'attraction_reviews';
            referencedColumns: ['id_arv'];
          },
          {
            foreignKeyName: 'attraction_review_interactions_user_fkey';
            columns: ['user_id_ari'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
      product_review_interactions: {
        Row: ProductReviewInteraction;
        Insert: Omit<ProductReviewInteraction, 'id_pri' | 'created_at_pri'> & {
          id_pri?: string;
          created_at_pri?: string;
        };
        Update: never;
        Relationships: [
          {
            foreignKeyName: 'product_review_interactions_review_fkey';
            columns: ['review_id_pri'];
            isOneToOne: false;
            referencedRelation: 'product_reviews';
            referencedColumns: ['id_prv'];
          },
          {
            foreignKeyName: 'product_review_interactions_user_fkey';
            columns: ['user_id_pri'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id_prf'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      moderation_status: ModerationStatus;
      promotion_scope: PromotionScope;
      discount_type: DiscountType;
      payment_state: PaymentState;
      interaction_type: InteractionType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
