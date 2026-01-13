import { UserRole } from '@/types/enums';

/**
 * Perfil de usuario
 * Tabla: profiles (PRF)
 */
export interface Profile {
  id_PRF: string;
  first_name_PRF: string;
  last_name1_PRF: string;
  last_name2_PRF: string | null;
  phone_number_PRF: string | null;
  role_PRF: UserRole;
  is_active_PRF: boolean;
  created_at_PRF: string;
  updated_at_PRF: string;
}

/**
 * Helper para obtener nombre completo formateado
 */
export function getFullName(profile: Profile): string {
  const parts = [profile.first_name_PRF, profile.last_name1_PRF];
  if (profile.last_name2_PRF) {
    parts.push(profile.last_name2_PRF);
  }
  return parts.join(' ');
}

export interface ProfileInsert extends Omit<Profile, 'id_PRF' | 'created_at_PRF' | 'updated_at_PRF' | 'is_active_PRF' | 'role_PRF'> {
  id_PRF: string;
  role_PRF?: UserRole;
  is_active_PRF?: boolean;
}

export interface ProfileUpdate extends Partial<Omit<Profile, 'id_PRF' | 'created_at_PRF'>> {}
