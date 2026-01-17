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
  if (!data.user) throw new Error('No se pudo crear el usuario');

  // CRÍTICO: Verificar que el perfil se creó correctamente
  // Esperar un momento para que el trigger se ejecute
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id_prf')
    .eq('id_prf', data.user.id)
    .single();

  // Si el perfil NO se creó, el usuario debe cerrar sesión y reportar error
  if (profileError || !profile) {
    
    // Cerrar la sesión del usuario recién creado
    await supabase.auth.signOut();

    // Lanzar error con mensaje específico
    if (profileError?.code === '23505') {
      // Código de PostgreSQL para violación de unique constraint
      const detail = profileError.details || profileError.message || '';
      if (detail.includes('phone')) {
        throw new Error('Este número de teléfono ya está registrado');
      } else if (detail.includes('email')) {
        throw new Error('Este correo electrónico ya está registrado');
      } else {
        throw new Error('Los datos ingresados ya están registrados');
      }
    } else {
      throw new Error('Error al crear el perfil. El usuario de autenticación fue creado pero hay un problema con los datos. Por favor contacta a soporte.');
    }
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
