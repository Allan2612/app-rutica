import { UserRole } from '@/types/enums';

// ============================================
// Profile - Tabla: profiles (prf)
// ============================================

/**
 * Perfil de usuario - Row type
 */
export interface Profile {
  id_prf: string;
  first_name_prf: string | null;
  last_name1_prf: string | null;
  last_name2_prf: string | null;
  phone_number_prf: string | null;
  role_prf: UserRole | null;
  is_active_prf: boolean;
  profile_photo_path_prf: string | null;
  created_at_prf: string;
  updated_at_prf: string;
}

/**
 * Profile Premium - Tabla: profile_premium (ppm)
 */
export interface ProfilePremium {
  profile_id_ppm: string;
  subscribed_at_ppm: string;
  payment_reference_ppm: string | null;
  payment_note_ppm: string | null;
  created_at_ppm: string;
  updated_at_ppm: string;
}

/**
 * Profile con relación premium
 */
export interface ProfileWithPremium extends Profile {
  premium?: ProfilePremium | null;
}

// ============================================
// Insert/Update Types
// ============================================

export interface ProfileInsert {
  id_prf: string; // Debe coincidir con auth.uid()
  first_name_prf?: string | null;
  last_name1_prf?: string | null;
  last_name2_prf?: string | null;
  phone_number_prf?: string | null;
  role_prf?: UserRole; // Default: 'user' en BD
  is_active_prf?: boolean;
  profile_photo_path_prf?: string | null;
}

export interface ProfileUpdate {
  first_name_prf?: string | null;
  last_name1_prf?: string | null;
  last_name2_prf?: string | null;
  phone_number_prf?: string | null;
  profile_photo_path_prf?: string | null;
  // role_prf y is_active_prf NO se pueden cambiar por el usuario (solo admin)
}

// ============================================
// Helpers
// ============================================

/**
 * Obtiene el nombre completo formateado
 */
export function getFullName(profile: Profile | null | undefined): string {
  if (!profile) return '';
  const parts = [
    profile.first_name_prf,
    profile.last_name1_prf,
    profile.last_name2_prf,
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Obtiene las iniciales del usuario
 */
export function getInitials(profile: Profile | null | undefined): string {
  if (!profile) return '?';
  const first = profile.first_name_prf?.[0] ?? '';
  const last = profile.last_name1_prf?.[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

/**
 * Verifica si el usuario tiene rol de vendedor o superior
 */
export function canSell(profile: Profile | null | undefined): boolean {
  if (!profile?.role_prf) return false;
  return ['seller', 'admin'].includes(profile.role_prf);
}

/**
 * Verifica si el usuario es admin
 */
export function isAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role_prf === 'admin';
}

/**
 * Verifica si el usuario es premium
 */
export function isPremium(profile: Profile | null | undefined): boolean {
  return profile?.role_prf === 'premium';
}

