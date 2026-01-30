import { supabase } from '@/lib/supabase/client';
import { UserRole } from '@/types/enums';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_IMAGES_BUCKET = 'profiles-images';
const PENDING_PROFILE_PHOTO_KEY = 'pending_profile_photo';

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName1: string;
  lastName2?: string;
  phone?: string;
  role: UserRole;
  profilePhotoUri?: string; // URI local de la foto de perfil
}

/**
 * Sube la foto de perfil al storage y retorna el path
 */
async function uploadProfilePhoto(
  userId: string,
  imageUri: string
): Promise<string> {
  const fileName = `${userId}/profile-${Date.now()}.jpg`;

  if (Platform.OS === 'web') {
    // Web: fetch y blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;
  } else {
    // Mobile: leer archivo como base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(fileName, byteArray, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;
  }

  return fileName;
}

export async function signUp(input: SignUpInput) {
  const { email, password, firstName, lastName1, lastName2, phone, role, profilePhotoUri } = input;

  // 1. Crear usuario en auth - El trigger handle_new_user() crea el perfil automáticamente
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

  // 2. Verificar que el perfil se creó correctamente por el trigger
  // Esperar un momento para que el trigger se ejecute
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id_prf')
    .eq('id_prf', data.user.id)
    .single();

  if (profileError || !profile) {
    // Si el perfil no se creó, cerrar sesión
    await supabase.auth.signOut();
    console.error('Error verificando perfil:', profileError);
    throw new Error('Error al crear el perfil. Por favor intenta nuevamente.');
  }

  // 3. Guardar foto de perfil pendiente si se proporcionó
  // La foto se subirá después del primer login cuando haya sesión activa
  if (profilePhotoUri) {
    try {
      await AsyncStorage.setItem(PENDING_PROFILE_PHOTO_KEY, JSON.stringify({
        uri: profilePhotoUri,
        userId: data.user.id,
      }));
    } catch (storageError) {
      console.warn('Error guardando foto pendiente:', storageError);
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

  // Después de login exitoso, intentar subir foto de perfil pendiente
  if (data.session && data.user) {
    await uploadPendingProfilePhoto(data.user.id);
  }

  return data.session;
}

/**
 * Sube la foto de perfil pendiente guardada durante el registro
 */
export async function uploadPendingProfilePhoto(userId: string): Promise<void> {
  try {
    const pendingPhotoJson = await AsyncStorage.getItem(PENDING_PROFILE_PHOTO_KEY);
    if (!pendingPhotoJson) return;

    const pendingPhoto = JSON.parse(pendingPhotoJson);

    // Verificar que la foto es para este usuario
    if (pendingPhoto.userId !== userId) {
      await AsyncStorage.removeItem(PENDING_PROFILE_PHOTO_KEY);
      return;
    }

    // Subir la foto
    const profilePhotoPath = await uploadProfilePhoto(userId, pendingPhoto.uri);

    // Actualizar el perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ profile_photo_path_prf: profilePhotoPath } as never)
      .eq('id_prf', userId);

    if (updateError) {
      console.warn('Error actualizando foto en perfil:', updateError);
    } else {
      // Limpiar foto pendiente solo si se subió correctamente
      await AsyncStorage.removeItem(PENDING_PROFILE_PHOTO_KEY);
    }
  } catch (error) {
    console.warn('Error subiendo foto pendiente:', error);
  }
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
