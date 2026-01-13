# Solución al Problema de Registro Transaccional

## 🔴 Problema Identificado

Cuando un usuario se registra y el trigger de Supabase falla (por ejemplo, teléfono duplicado), el usuario se crea en `auth.users` pero NO en `profiles`. Esto deja el sistema en estado inconsistente.

## ✅ Solución Implementada

### 1. Verificación post-registro (Frontend)

El servicio `signUp` ahora verifica que el perfil se haya creado correctamente después del registro. Si falla:
- Cierra la sesión del usuario recién creado
- Muestra un mensaje de error específico
- No permite continuar con el flujo

### 2. Solución definitiva: Mejorar el Trigger (Backend)

**Archivo**: `docs/AUTH_TRIGGER_FIX.sql`

Para eliminar el usuario de auth cuando falla la creación del perfil, necesitas crear una función RPC con permisos de service_role.

#### Pasos en Supabase Dashboard:

1. **SQL Editor** → **New Query**
2. Ejecuta el script `AUTH_TRIGGER_FIX.sql`
3. Esto creará:
   - Función RPC para eliminar usuarios de auth
   - Trigger mejorado que hace rollback automático

## 🛡️ Prevención de Estados Inconsistentes

### Opción A: Validar ANTES de crear usuario
```sql
CREATE OR REPLACE FUNCTION validate_before_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar teléfono único
  IF NEW.phone IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM profiles 
      WHERE phone = NEW.phone 
      AND id_prf != NEW.id_prf
    ) THEN
      RAISE EXCEPTION 'Este número de teléfono ya está registrado';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Opción B: Usar política de retry en el frontend
El código actual ya implementa:
- ✅ Espera 2 segundos para que el trigger se ejecute
- ✅ Verifica que el perfil existe
- ✅ Cierra sesión si falló
- ✅ Muestra error específico (teléfono/email duplicado)

## 📱 Notificaciones al Usuario

Ahora se usa `react-native-toast-message` en lugar de `Alert`:

### RegisterScreen
- ❌ Campos incompletos
- ❌ Contraseñas no coinciden  
- ❌ Contraseña muy corta
- ❌ Error de registro (con mensaje específico)
- ✅ Registro exitoso → Redirige a login

### LoginScreen
- ❌ Campos incompletos
- ❌ Credenciales incorrectas
- ✅ Bienvenido → Redirige a home

## 🔧 Mantenimiento Futuro

### Para limpiar usuarios huérfanos actuales:
```sql
-- Ver usuarios sin perfil
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id_prf
WHERE p.id_prf IS NULL;

-- Eliminar usuarios sin perfil (¡CUIDADO!)
-- Solo ejecutar si estás seguro
DELETE FROM auth.users
WHERE id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id_prf
  WHERE p.id_prf IS NULL
);
```

## 📋 Checklist de Implementación

- [x] Agregar Toast messages
- [x] Verificar perfil después de registro
- [x] Cerrar sesión si falla el perfil
- [x] Mensajes de error específicos
- [x] Redirigir a login después de registro exitoso
- [ ] Ejecutar SQL para mejorar trigger (requiere acceso a Supabase Dashboard)
- [ ] Limpiar usuarios huérfanos existentes (opcional)

## 🧪 Testing

Para probar el flujo:

1. **Caso exitoso**:
   - Registrar con datos únicos
   - Verificar redirección a login
   - Toast de éxito visible

2. **Caso de error (teléfono duplicado)**:
   - Registrar con teléfono existente
   - Verificar que NO se crea auth user
   - Toast de error específico visible

3. **Caso de error (email duplicado)**:
   - Intentar registrar email existente
   - Supabase lo rechaza antes de crear usuario
   - Toast de error visible
