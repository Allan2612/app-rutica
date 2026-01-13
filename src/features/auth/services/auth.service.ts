import { supabase } from '@/lib/supabase/client';
import { UserRole } from '@/types/enums';

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName1: string;
  lastName2?: string;
  phone?: string;
  role: UserRole;
}

export async function signUp(input: SignUpInput) {
  const { email, password, firstName, lastName1, lastName2, phone, role } = input;

  // Crear usuario en auth con metadata
  // El trigger en Supabase creará automáticamente el perfil
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name1: lastName1,
        last_name2: lastName2 || null,
        phone: phone || null,
        role: role,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('User not created');

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
