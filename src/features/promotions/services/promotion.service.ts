import { supabase } from '@/lib/supabase/client';
import { Promotion } from '@/types/entities';
import { PromoScope, DiscountType } from '@/types/enums';

export interface CreatePromotionInput {
  businessId: string;
  createdBy: string;
  scope: PromoScope;
  title: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  startAt: string; // ISO string
  endAt: string; // ISO string
  paymentReference?: string;
  paymentNote?: string;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function createPromotion(input: CreatePromotionInput): Promise<Promotion> {
  const id = generateUUID();

  const { data, error } = await supabase
    .from('promotions')
    .insert({
      id_PRM: id,
      business_id_PRM: input.businessId,
      created_by_PRM: input.createdBy,
      scope_PRM: input.scope,
      title_PRM: input.title,
      description_PRM: input.description ?? null,
      discount_type_PRM: input.discountType ?? 'percentage',
      discount_value_PRM: input.discountValue ?? 0,
      start_at_PRM: input.startAt,
      end_at_PRM: input.endAt,
      payment_reference_PRM: input.paymentReference ?? null,
      payment_note_PRM: input.paymentNote ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function linkPromotionProduct(promotionId: string, productId: string): Promise<boolean> {
  const { error } = await supabase
    .from('promotion_products')
    .insert({ promotion_id_PPR: promotionId, product_id_PPR: productId });

  if (error) throw error;
  return true;
}

export async function linkPromotionCategory(promotionId: string, categoryId: string): Promise<boolean> {
  const { error } = await supabase
    .from('promotion_categories')
    .insert({ promotion_id_PCR: promotionId, category_id_PCR: categoryId });

  if (error) throw error;
  return true;
}

export async function getPromotionsByBusiness(businessId: string): Promise<Promotion[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('business_id_PRM', businessId)
    .order('created_at_PRM', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('moderation_status_PRM', 'approved')
    .lte('start_at_PRM', now)
    .gte('end_at_PRM', now)
    .order('placement_score_PRM', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPromotionById(promotionId: string): Promise<Promotion> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('id_PRM', promotionId)
    .single();

  if (error) throw error;
  return data;
}

export async function updatePromotion(promotionId: string, updates: Partial<Promotion>): Promise<Promotion> {
  const { data, error } = await supabase
    .from('promotions')
    .update(updates)
    .eq('id_PRM', promotionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePromotion(promotionId: string): Promise<void> {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id_PRM', promotionId);

  if (error) throw error;
}
