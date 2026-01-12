# AuthStore - Sistema de Autenticación

## Descripción General

`authStore` es el **store global de autenticación** de la aplicación, construido con Zustand. Funciona como **única fuente de verdad** para el estado de autenticación del usuario en toda la app.

## Ubicación

**Archivo:** [`src/store/authStore.ts`](../src/store/authStore.ts)

## Arquitectura

### 1. Estado (AuthState)

```typescript
interface AuthState {
  user: User | null;              // Usuario de Supabase Auth
  role: UserRole | null;          // Rol del perfil (admin, business, tourist)
  isLoading: boolean;             // Loading visible para el UI
  isAuthenticated: boolean;       // Estado de autenticación
  _initialized: boolean;          // Flag: ¿ya se inicializó el listener?
  _isLoadingData: boolean;        // Flag: ¿hay una carga de datos en curso?
}
```

### 2. Acciones (AuthActions)

#### `setUser(user: User | null)`
Establece el usuario actual y actualiza `isAuthenticated`.

#### `setRole(role: UserRole | null)`
Establece el rol del usuario.

#### `setLoading(isLoading: boolean)`
Controla el estado de carga visible para el UI.

#### `loadUserData(): Promise<void>`
Carga completa del usuario autenticado:

1. **Protección contra cargas simultáneas:** Verifica `_isLoadingData` y sale si hay otra carga en curso
2. **Verificación de sesión:** Consulta `supabase.auth.getSession()`
3. **Validación del token:** Llama a `supabase.auth.getUser()` con timeout de 10s
4. **Carga del perfil:** Consulta la tabla `profiles` para obtener `role_prf`
5. **Manejo de errores:**
   - Token inválido → Cierra sesión
   - Perfil no existe (PGRST116) → Cierra sesión
   - Otros errores → Mantiene sesión sin rol

**Nota:** Esta función es llamada automáticamente por el listener, **NO** se debe llamar manualmente en componentes (excepto casos muy específicos).

#### `signOut(): Promise<void>`
Cierra la sesión del usuario:

1. Llama a `supabase.auth.signOut()`
2. Limpia todo el estado local
3. En caso de error, igual limpia el estado (fail-safe)

#### `initialize(): void`
**Debe ejecutarse una sola vez al inicio de la app** (en el `_layout.tsx` raíz):

1. **Previene reinicializaciones:** Sale si `_initialized === true`
2. **Registra el listener:** Configura `onAuthStateChange` antes de cargar datos (evita race conditions)
3. **Eventos manejados:**
   - `SIGNED_OUT` → Limpia el estado
   - `SIGNED_IN` → Carga datos del usuario
   - `TOKEN_REFRESHED` → Recarga si el ID cambió
   - `USER_UPDATED` → Recarga datos
4. **Carga inicial:** Llama a `loadUserData()` después de registrar el listener

#### `cleanup(): void`
**Debe ejecutarse al desmontar el layout raíz:**

1. Desuscribe el listener de Supabase
2. Resetea `_initialized` y `_isLoadingData`

## Flujo de Autenticación

### Inicio de la App

```
App Mount
   │
   ├─→ _layout.tsx ejecuta initialize()
   │      │
   │      ├─→ Registra onAuthStateChange listener
   │      └─→ Llama loadUserData()
   │             │
   │             ├─→ getSession() → ¿Hay sesión?
   │             ├─→ getUser() → ¿Token válido?
   │             └─→ Query profiles → ¿Rol?
   │
   └─→ app/index.tsx lee el estado:
          ├─→ isLoading === true → Muestra ActivityIndicator
          ├─→ isAuthenticated === true → Redirige a /(app)/(tabs)/home
          └─→ isAuthenticated === false → Redirige a /(auth)/login
```

### Login de Usuario

```
LoginScreen
   │
   ├─→ Usuario ingresa credenciales
   ├─→ authService.signIn(email, password)
   │      │
   │      └─→ supabase.auth.signInWithPassword()
   │             │
   │             └─→ ✅ Auth exitoso
   │
   ├─→ [LISTENER] Detecta evento SIGNED_IN
   │      │
   │      └─→ Ejecuta loadUserData()
   │             │
   │             └─→ Actualiza store con user + role
   │
   ├─→ Espera 100ms (delay para listener)
   └─→ router.replace('/(app)/(tabs)/home')
```

**Importante:** El `LoginScreen` **NO** llama a `loadUserData()` manualmente. Confía 100% en el listener automático.

### Logout de Usuario

```
UserMenu (Header)
   │
   ├─→ Usuario presiona "Cerrar sesión"
   ├─→ authStore.signOut()
   │      │
   │      ├─→ supabase.auth.signOut()
   │      └─→ Limpia estado local
   │
   ├─→ [LISTENER] Detecta evento SIGNED_OUT
   │      │
   │      └─→ Limpia estado adicional (redundante pero seguro)
   │
   └─→ router.replace('/(auth)/login')
```

### Refresh de Token

```
Supabase Auto-Refresh
   │
   ├─→ Token expira (cada ~1 hora)
   ├─→ Supabase refresca automáticamente
   ├─→ [LISTENER] Detecta TOKEN_REFRESHED
   │      │
   │      └─→ Verifica si el user.id cambió
   │             │
   │             ├─→ Cambió → loadUserData() (usuario diferente)
   │             └─→ No cambió → No hace nada (mismo usuario)
   │
   └─→ Sesión continúa sin interrupciones
```

## Prevención de Race Conditions

### Problema Original

Antes de la refactorización, existían múltiples problemas:

1. **Múltiples fuentes de verdad:** `useAuth` hook, checks manuales en `app/index.tsx`, y `authStore`
2. **Listener registrado después de `loadUserData()`:** El evento `SIGNED_IN` se perdía
3. **`loadUserData()` verificaba `isLoading`:** Se bloqueaba a sí mismo
4. **Login llamaba `loadUserData()` manualmente:** Causaba doble carga (manual + listener)

### Solución Implementada

1. **Flag `_isLoadingData` separado:** Previene cargas simultáneas sin bloquear el UI
2. **Listener registrado ANTES de `loadUserData()`:** Garantiza que todos los eventos se capturen
3. **`LoginScreen` confía en el listener:** Eliminada la llamada manual
4. **`authStore` como única fuente:** Todos los componentes leen del store

## Uso en Componentes

### Leer Estado

```typescript
import { useAuthStore } from '@/store';

function MyComponent() {
  const { user, role, isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <ActivityIndicator />;
  if (!isAuthenticated) return <Login />;
  
  return <Text>Hola {user?.email}</Text>;
}
```

### Ejecutar Acciones

```typescript
import { useAuthStore } from '@/store';

function LogoutButton() {
  const signOut = useAuthStore((state) => state.signOut);
  
  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };
  
  return <Button onPress={handleLogout}>Cerrar sesión</Button>;
}
```

### Selectores Optimizados

```typescript
// ❌ MAL: Re-renderiza en cualquier cambio del store
function BadComponent() {
  const store = useAuthStore();
  return <Text>{store.user?.email}</Text>;
}

// ✅ BIEN: Solo re-renderiza si cambia user.email
function GoodComponent() {
  const userEmail = useAuthStore((state) => state.user?.email);
  return <Text>{userEmail}</Text>;
}
```

## Inicialización en Root Layout

**Archivo:** [`app/_layout.tsx`](../app/_layout.tsx)

```typescript
import { useAuthStore } from '@/store';

export default function RootLayout() {
  const { initialize, cleanup } = useAuthStore();

  useEffect(() => {
    initialize();
    
    // Timeout de seguridad (12s)
    const timeout = setTimeout(() => {
      console.warn('[APP] Timeout: forzando isLoading = false');
      useAuthStore.setState({ isLoading: false });
    }, 12000);

    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  }, []);

  return <Stack />;
}
```

## Timeouts y Seguridad

- **`loadUserData()` timeout:** 10 segundos para `getUser()` y `profiles` query
- **Root layout timeout:** 12 segundos forzando `isLoading = false` (safety net)
- **Fail-safe en `signOut()`:** Limpia estado local incluso si Supabase falla

## Consideraciones de Performance

1. **Zustand es ligero:** No causa re-renders innecesarios
2. **Usar selectores:** `useAuthStore((state) => state.user)` en lugar de `useAuthStore()`
3. **`_isLoadingData` es interno:** No lo uses en el UI, solo `isLoading`
4. **No llamar `loadUserData()` manualmente:** El listener lo maneja automáticamente

## Troubleshooting

### "El usuario se desloguea al recargar"
- Verifica que `initialize()` se llame en el root layout
- Revisa que no haya múltiples llamadas a `initialize()`
- Asegúrate de que Supabase tenga persistencia habilitada

### "Pantalla de carga infinita"
- Verifica el timeout de 12s en `_layout.tsx`
- Revisa la consola por errores en `loadUserData()`
- Confirma que la tabla `profiles` exista y tenga datos

### "El listener no se ejecuta"
- Asegúrate de que `initialize()` se llame antes de cualquier acción de auth
- Verifica que `cleanup()` no se ejecute prematuramente

### "Doble carga de datos"
- Elimina cualquier llamada manual a `loadUserData()` en `LoginScreen` u otros componentes
- Solo el listener debe invocar `loadUserData()`

## Logs de Producción

El store solo imprime logs de error críticos:

```typescript
console.error('[AUTH] Error al validar usuario:', err);
console.warn('[AUTH] Token inválido, cerrando sesión');
console.error('[AUTH] Error al cargar perfil:', err);
console.warn('[AUTH] Perfil no existe, cerrando sesión');
console.error('[AUTH] Error crítico:', error?.message);
console.error('[AUTH] Error al cerrar sesión:', error);
```

Los logs de debug/progreso fueron removidos en la última optimización.

## Dependencias

- **Zustand:** `^4.x` - State management
- **Supabase JS:** `^2.x` - Auth y queries
- **React Native:** Para `AsyncStorage` / `ExpoSecureStoreAdapter`

## Archivos Relacionados

- [`app/_layout.tsx`](../app/_layout.tsx) - Inicialización
- [`app/index.tsx`](../app/index.tsx) - Redirección basada en auth
- [`src/features/auth/screens/LoginScreen/`](../src/features/auth/screens/LoginScreen/) - Login
- [`src/components/layout/Header/UserMenu/`](../src/components/layout/Header/UserMenu/) - Logout
- [`src/lib/supabase/client.ts`](../src/lib/supabase/client.ts) - Cliente de Supabase

## Historial de Cambios

**Última actualización:** 12 de enero de 2026

- ✅ Agregado flag `_isLoadingData` para prevenir race conditions
- ✅ Listener registrado antes de `loadUserData()` inicial
- ✅ Removidas llamadas manuales a `loadUserData()` en `LoginScreen`
- ✅ `UserMenu` usa `store.signOut()` en lugar de `service.signOut()`
- ✅ `app/index.tsx` refactorizado para usar `useAuthStore`
- ✅ Deprecado `useAuth` hook (redundante)
- ✅ Removidos todos los logs de debug
