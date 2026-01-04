import { supabase } from '../../../lib/supabase/client';
import { UserRole } from '../../../types/enums';

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export async function signUp(input: SignUpInput) {
  const { email, password, fullName, phone, role } = input;

  // 1. Crear usuario en auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('User not created');

  // 2. Crear perfil manualmente
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id_PRF: data.user.id,
      full_name_PRF: fullName,
      phone_number_PRF: phone || null,
      role_PRF: role,
      is_active_PRF: true,
    });

  if (profileError) {
    console.error('Error creando perfil:', profileError);
    throw new Error('Error al crear el perfil: ' + profileError.message);
  }

  return data.user;
}

export interface SignInInput {
  email: string;
  password: string;
}

export async function signIn(input: SignInInput) {
  const { email, password } = input;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
