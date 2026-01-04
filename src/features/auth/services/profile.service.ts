import { supabase } from '../../../lib/supabase/client';
import { Profile } from '../../../types/entities';
import { UserRole } from '../../../types/enums';

export async function getMyProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileById(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id_PRF', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role_PRF: role })
    .eq('id_PRF', userId);

  if (error) throw error;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id_PRF', userId);

  if (error) throw error;
}
