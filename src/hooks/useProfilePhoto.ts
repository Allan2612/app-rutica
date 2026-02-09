import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Hook para obtener la URL pública de la foto de perfil del usuario
 */
export function useProfilePhoto(userId: string | undefined): string | null {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setPhotoUrl(null);
      return;
    }

    const fetchProfilePhoto = async () => {
      try {
        // Obtener el path de la foto desde el perfil
        const { data: profile, error } = (await supabase
          .from('profiles')
          .select('profile_photo_path_prf')
          .eq('id_prf', userId)
          .single()) as { data: any; error: any };

        if (error || !profile?.profile_photo_path_prf) {
          setPhotoUrl(null);
          return;
        }

        // Obtener URL pública del storage
        const {
          data: { publicUrl },
        } = supabase.storage.from('profiles-images').getPublicUrl(profile.profile_photo_path_prf);

        setPhotoUrl(publicUrl);
      } catch (err) {
        console.warn('Error cargando foto de perfil:', err);
        setPhotoUrl(null);
      }
    };

    fetchProfilePhoto();
  }, [userId]);

  return photoUrl;
}
