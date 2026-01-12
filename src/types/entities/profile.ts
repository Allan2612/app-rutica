import { UserRole } from '@/types/enums';

export interface Profile {
  id_PRF: string;
  full_name_PRF: string;
  phone_number_PRF: string | null;
  role_PRF: UserRole;
  is_active_PRF: boolean;
  created_at_PRF: string;
  updated_at_PRF: string;
}

export interface ProfileInsert extends Omit<Profile, 'id_PRF' | 'created_at_PRF' | 'updated_at_PRF' | 'is_active_PRF' | 'role_PRF'> {
  id_PRF: string;
  role_PRF?: UserRole;
  is_active_PRF?: boolean;
}

export interface ProfileUpdate extends Partial<Omit<Profile, 'id_PRF' | 'created_at_PRF'>> {}
