import { Profile } from './profile';
import { Business } from './business';
import { Product } from './product';
import { Attraction } from './attraction';

export interface BusinessReview {
  id_BRV: string;
  business_id_BRV: string;
  user_id_BRV: string;
  rating_BRV: number;
  comment_BRV: string | null;
  created_at_BRV: string;
}

export interface BusinessReviewWithRelations extends BusinessReview {
  user?: Profile;
  business?: Business;
}

export interface ProductReview {
  id_PRV: string;
  product_id_PRV: string;
  user_id_PRV: string;
  rating_PRV: number;
  comment_PRV: string | null;
  created_at_PRV: string;
}

export interface ProductReviewWithRelations extends ProductReview {
  user?: Profile;
  product?: Product;
}

export interface AttractionReview {
  id_ARV: string;
  attraction_id_ARV: string;
  user_id_ARV: string;
  rating_ARV: number;
  comment_ARV: string | null;
  created_at_ARV: string;
}

export interface AttractionReviewWithRelations extends AttractionReview {
  user?: Profile;
  attraction?: Attraction;
}

export interface BusinessReviewInsert extends Omit<BusinessReview, 'id_BRV' | 'created_at_BRV'> {
  id_BRV?: string;
}

export interface ProductReviewInsert extends Omit<ProductReview, 'id_PRV' | 'created_at_PRV'> {
  id_PRV?: string;
}

export interface AttractionReviewInsert extends Omit<AttractionReview, 'id_ARV' | 'created_at_ARV'> {
  id_ARV?: string;
}
