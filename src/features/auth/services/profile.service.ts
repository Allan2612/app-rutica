import { supabase } from '@/lib/supabase/client';
import type { Profile, ProfileUpdate, ProfileWithPremium, ProfilePremium } from '@/types/entities';
import type { UserRole } from '@/types/enums';

// ============================================
// Queries
// ============================================

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getMyProfile(): Promise<Profile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id_prf', user.id)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Obtiene el perfil del usuario autenticado con información premium
 */
export async function getMyProfileWithPremium(): Promise<ProfileWithPremium> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user');

  // Obtener perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id_prf', user.id)
    .single();

  if (profileError) throw profileError;

  // Obtener premium si existe
  const { data: premium } = await supabase
    .from('profile_premium')
    .select('*')
    .eq('profile_id_ppm', user.id)
    .maybeSingle();

  return {
    ...(profile as Profile),
    premium: premium as ProfilePremium | null,
  };
}

/**
 * Obtiene un perfil por su ID
 */
export async function getProfileById(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id_prf', userId).single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Obtiene un perfil con información premium por su ID
 */
export async function getProfileWithPremiumById(userId: string): Promise<ProfileWithPremium> {
  // Obtener perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id_prf', userId)
    .single();

  if (profileError) throw profileError;

  // Obtener premium si existe
  const { data: premium } = await supabase
    .from('profile_premium')
    .select('*')
    .eq('profile_id_ppm', userId)
    .maybeSingle();

  return {
    ...(profile as Profile),
    premium: premium as ProfilePremium | null,
  };
}

/**
 * Verifica si un usuario tiene suscripción premium activa
 */
export async function checkPremiumStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profile_premium')
    .select('profile_id_ppm')
    .eq('profile_id_ppm', userId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

// ============================================
// Mutations
// ============================================

/**
 * Actualiza el rol de un usuario (solo admin)
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role_prf: role } as never)
    .eq('id_prf', userId);

  if (error) throw error;
}

/**
 * Actualiza el perfil de un usuario
 */
export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId);

  if (error) throw error;
}

/**
 * Actualiza el perfil del usuario autenticado
 */
export async function updateMyProfile(updates: ProfileUpdate): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No authenticated user');

  await updateProfile(user.id, updates);
}

/**
 * Activa/desactiva un usuario (solo admin)
 */
export async function setProfileActiveStatus(userId: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_active_prf: isActive,
      updated_at_prf: new Date().toISOString(),
    } as never)
    .eq('id_prf', userId);

  if (error) throw error;
}

// ============================================
// Premium Management (Admin)
// ============================================

/**
 * Registra una suscripción premium para un usuario
 */
export async function createPremiumSubscription(
  userId: string,
  paymentReference?: string,
  paymentNote?: string,
): Promise<ProfilePremium> {
  const { data, error } = await supabase
    .from('profile_premium')
    .insert({
      profile_id_ppm: userId,
      payment_reference_ppm: paymentReference ?? null,
      payment_note_ppm: paymentNote ?? null,
    } as never)
    .select()
    .single();

  if (error) throw error;
  return data as ProfilePremium;
}

/**
 * Elimina la suscripción premium de un usuario
 */
export async function removePremiumSubscription(userId: string): Promise<void> {
  const { error } = await supabase.from('profile_premium').delete().eq('profile_id_ppm', userId);

  if (error) throw error;
}
