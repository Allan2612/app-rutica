-- ===================================================================
-- SOLUCIÓN PARA REGISTRO TRANSACCIONAL EN SUPABASE
-- ===================================================================
-- Este script mejora el trigger de creación de perfiles para que
-- elimine automáticamente el usuario de auth si falla la creación
-- del perfil (ej: teléfono duplicado)
-- ===================================================================

-- 1. Crear función RPC para eliminar usuarios (requiere service_role)
-- ===================================================================
CREATE OR REPLACE FUNCTION delete_auth_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con permisos del creador (service_role)
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Dar permisos solo a usuarios autenticados
GRANT EXECUTE ON FUNCTION delete_auth_user(UUID) TO authenticated;

-- 2. Crear trigger mejorado con rollback automático
-- ===================================================================
CREATE OR REPLACE FUNCTION handle_new_user_with_rollback()
RETURNS TRIGGER AS $$
DECLARE
  v_error_detail TEXT;
BEGIN
  -- Intentar crear el perfil
  BEGIN
    INSERT INTO public.profiles (
      id_prf,
      first_name_prf,
      last_name1_prf,
      last_name2_prf,
      phone_prf,
      role_prf,
      created_at_prf,
      updated_at_prf
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name1',
      NEW.raw_user_meta_data->>'last_name2',
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
      NOW(),
      NOW()
    );

    -- Si llegamos aquí, todo salió bien
    RETURN NEW;

  EXCEPTION
    WHEN unique_violation THEN
      -- Error de duplicado (teléfono, email, etc)
      GET STACKED DIAGNOSTICS v_error_detail = MESSAGE_TEXT;
      
      -- Eliminar el usuario de auth (rollback)
      PERFORM delete_auth_user(NEW.id);
      
      -- Re-lanzar el error para que el frontend lo reciba
      RAISE EXCEPTION 'Error al crear perfil: %', v_error_detail;
      
    WHEN OTHERS THEN
      -- Cualquier otro error
      GET STACKED DIAGNOSTICS v_error_detail = MESSAGE_TEXT;
      
      -- Eliminar el usuario de auth (rollback)
      PERFORM delete_auth_user(NEW.id);
      
      -- Re-lanzar el error
      RAISE EXCEPTION 'Error inesperado al crear perfil: %', v_error_detail;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Eliminar trigger anterior si existe
-- ===================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Crear nuevo trigger
-- ===================================================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_with_rollback();

-- 5. Añadir constraint único en phone si no existe
-- ===================================================================
-- Esto previene duplicados a nivel de base de datos
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_phone_prf_key;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_phone_prf_unique 
UNIQUE (phone_prf)
WHERE phone_prf IS NOT NULL;

-- 6. (OPCIONAL) Limpiar usuarios huérfanos existentes
-- ===================================================================
-- ADVERTENCIA: Esto eliminará permanentemente usuarios sin perfil
-- Solo ejecutar si estás seguro que quieres limpiar datos antiguos

-- Primero, ver cuántos hay:
SELECT COUNT(*) as usuarios_sin_perfil
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id_prf
WHERE p.id_prf IS NULL;

-- Si quieres eliminarlos, descomenta esto:
/*
DELETE FROM auth.users
WHERE id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id_prf
  WHERE p.id_prf IS NULL
);
*/

-- ===================================================================
-- VERIFICACIÓN
-- ===================================================================
-- Para probar que funciona, intenta registrar un usuario con:
-- 1. Teléfono duplicado → Debe fallar Y eliminar el auth user
-- 2. Datos únicos → Debe crear ambos correctamente

-- Ver logs del trigger:
-- SELECT * FROM pg_stat_user_functions 
-- WHERE funcname LIKE '%handle_new_user%';
