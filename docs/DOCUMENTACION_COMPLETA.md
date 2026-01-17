# Documentación Completa - App Rutica

**Última actualización:** 17 de enero de 2026  
**Versión:** 2.0.0

---

## 📚 Tabla de Contenidos

1. [Estándares del Proyecto](#1-estándares-del-proyecto)
2. [Modelo de Base de Datos](#2-modelo-de-base-de-datos)
3. [Sistema de Autenticación (AuthStore)](#3-sistema-de-autenticación-authstore)
4. [Sistema de Temas (Dark Mode)](#4-sistema-de-temas-dark-mode)
5. [Tab Gestionar - Hub por Rol](#5-tab-gestionar---hub-por-rol)
6. [Verificación de Modelo BD vs Código](#6-verificación-de-modelo-bd-vs-código)
7. [Gestión de Imágenes y Storage](#7-gestión-de-imágenes-y-storage)

---

# 1. Estándares del Proyecto

## 1.1 Estructura de Archivos

Cada componente/screen debe seguir esta estructura:
```
ComponenteName/
├── index.ts          # Re-exporta el componente
├── ComponentName.tsx # Implementación
└── styles.ts         # Estilos (StyleSheet.create)
```

## 1.2 Imports

- **SIEMPRE usar alias `@/`** en lugar de rutas relativas `../../../`
- Configurado en `tsconfig.json` → `paths: { "@/*": ["src/*"] }`

### ✅ Correcto:
```typescript
import { colors } from '@/styles/theme/colors';
import { useAuthStore } from '@/store';
import { ProfileCard } from '@/components/user';
```

### ❌ Incorrecto:
```typescript
import { colors } from '../../../styles/theme/colors';
import { useAuthStore } from '../../../store';
```

## 1.3 Exports

- **Componentes y servicios**: Named exports (`export const/function`)
- **Screens**: Default export (`export default`)
- **Barrel files (index.ts)**: `export *` para re-exportar

### Componentes:
```typescript
// ProfileCard.tsx
export const ProfileCard = memo(function ProfileCard() { ... });

// index.ts
export * from './ProfileCard';
```

### Screens:
```typescript
// ProfileScreen.tsx
export default memo(function ProfileScreen() { ... });

// app/(app)/profile/index.tsx
export { default } from '@/features/user/ProfileScreen';
```

## 1.4 Colores y Estilos

- **NO usar colores hardcoded** (`#10b981`, `#333`, `#666`)
- **SIEMPRE usar theme**: `colors.primary[500]`, `colors.text.primary`
- **Estilos compartidos**: `src/styles/placeholder-screen-styles.ts` para placeholders

### ✅ Correcto:
```typescript
import { useThemedColors } from '@/hooks';

const colors = useThemedColors();

backgroundColor: colors.background.primary,
color: colors.text.secondary,
borderColor: colors.border.medium,
```

### ❌ Incorrecto:
```typescript
backgroundColor: '#fff',
color: '#666',
borderColor: '#e5e5e5',
```

## 1.5 Logging

- **Producción**: Solo `console.error` para errores críticos
- **NO usar**: `console.log` para debug (remover antes de commit)

## 1.6 TypeScript

- Tipos en `src/types/entities/` y `src/types/enums/`
- Interfaces locales en el mismo archivo del componente
- Props: `ComponentNameProps` interface

## 1.7 Features Incompletas

Screens que son placeholders (solo texto "Próximamente"):
- `home/screens/HomeScreen`
- `business/screens/BusinessesScreen`
- `events/screens/EventsScreen`
- `attractions/screens/AttractionsScreen`
- `promotions/screens/PromotionsListScreen`

**Todos usan**: `placeholderScreenStyles` de `@/styles/placeholder-screen-styles`

---

# 2. Modelo de Base de Datos

## 2.1 Convención de Nomenclatura

Todas las tablas y columnas siguen un patrón consistente:
- **Tablas**: nombre en inglés, snake_case, plural
- **Columnas**: `nombre_columna_SUFIJO` donde SUFIJO es un código de 3 letras
- **Claves primarias**: `id_SUFIJO`
- **Timestamps**: `created_at_SUFIJO`, `updated_at_SUFIJO`

### Sufijos de Tablas

| Sufijo | Tabla | Descripción |
|--------|-------|-------------|
| PRF | profiles | Perfiles de usuario |
| LOC | locations | Ubicaciones geográficas |
| BUS | businesses | Negocios |
| BIM | business_images | Imágenes de negocios |
| BCM | business_category_map | Categorías de negocios (N:N) |
| CAT | categories | Categorías |
| EVT | events | Eventos |
| EIM | event_images | Imágenes de eventos |
| ATR | attractions | Atracciones turísticas |
| AIM | attraction_images | Imágenes de atracciones |
| PRM | promotions | Promociones |
| PRD | products | Productos |
| PIM | product_images | Imágenes de productos |

## 2.2 Tipos Enumerados (ENUMs)

```typescript
// Rol del usuario
type UserRole = 'buyer' | 'seller' | 'admin';

// Estado de moderación
type ModerationStatus = 'pending' | 'approved' | 'rejected';

// Tipo de evento
type EventType = 'festival' | 'market' | 'concert' | 'workshop' | 'tour' | 'other';

// Tipo de descuento
type DiscountType = 'none' | 'percentage' | 'fixed';

// Tipo de imagen
type ImageType = 'logo' | 'cover' | 'gallery';
```

## 2.3 Tablas Principales

### profiles (PRF)

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| `id_prf` | uuid | NO | - | PK, ref a auth.users.id |
| `first_name_prf` | text | NO | - | Nombre |
| `last_name1_prf` | text | NO | - | Primer apellido |
| `last_name2_prf` | text | SI | NULL | Segundo apellido |
| `phone_number_prf` | text | SI | NULL | Teléfono |
| `role_prf` | user_role | NO | 'buyer' | Rol |
| `is_active_prf` | boolean | NO | true | Activo |
| `created_at_prf` | timestamptz | NO | now() | Creación |
| `updated_at_prf` | timestamptz | NO | now() | Actualización |

### businesses (BUS)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_bus` | uuid | NO | PK |
| `owner_id_bus` | uuid | NO | FK → profiles |
| `name_bus` | text | NO | Nombre del negocio |
| `description_bus` | text | SI | Descripción |
| `location_id_bus` | uuid | SI | FK → locations |
| `contact_phone_bus` | text | SI | Teléfono |
| `contact_email_bus` | text | SI | Email |
| `website_bus` | text | SI | Sitio web |
| `social_links_bus` | jsonb | SI | Redes sociales |
| `moderation_status_bus` | moderation_status | NO | Estado moderación |
| `is_active_bus` | boolean | NO | Activo |
| `avg_rating_bus` | numeric(3,2) | SI | Rating promedio |
| `reviews_count_bus` | integer | NO | Cantidad reviews |
| `created_at_bus` | timestamptz | NO | Creación |
| `updated_at_bus` | timestamptz | NO | Actualización |

### business_images (BIM)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_bim` | uuid | NO | PK |
| `business_id_bim` | uuid | NO | FK → businesses |
| `image_type_bim` | text | NO | 'logo', 'cover', 'gallery' |
| `bucket_bim` | text | NO | 'business-images' |
| `path_bim` | text | NO | Path en bucket |
| `sort_order_bim` | integer | NO | Orden (0=logo, 1=cover, 2+=gallery) |
| `created_at_bim` | timestamptz | NO | Creación |

**Límite de imágenes por negocio:**
- 1 logo (sort_order = 0)
- 1 cover (sort_order = 1)
- 4 gallery (sort_order = 2,3,4,5)
- **Total: 6 imágenes máximo**

### locations (LOC)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_loc` | uuid | NO | PK |
| `country_loc` | text | SI | País (default: 'Costa Rica') |
| `province_loc` | text | SI | Provincia |
| `canton_loc` | text | SI | Cantón |
| `district_loc` | text | SI | Distrito |
| `address_loc` | text | SI | Dirección específica |
| `latitude_loc` | numeric(10,8) | SI | Latitud |
| `longitude_loc` | numeric(11,8) | SI | Longitud |
| `created_at_loc` | timestamptz | NO | Creación |

**Compartición:** Las ubicaciones pueden ser compartidas entre múltiples negocios/eventos.

### events (EVT)

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id_evt` | uuid | NO | PK |
| `submitted_by_evt` | uuid | NO | FK → profiles |
| `name_evt` | text | NO | Nombre |
| `description_evt` | text | SI | Descripción |
| `event_type_evt` | event_type | NO | Tipo |
| `location_id_evt` | uuid | SI | FK → locations |
| `start_at_evt` | timestamptz | NO | Inicio |
| `end_at_evt` | timestamptz | NO | Fin |
| `moderation_status_evt` | moderation_status | NO | Estado |
| `is_active_evt` | boolean | NO | Activo |
| `created_at_evt` | timestamptz | NO | Creación |
| `updated_at_evt` | timestamptz | NO | Actualización |

## 2.4 Relaciones Clave

```
profiles (PRF)
    ├── businesses (BUS) [owner_id]
    │   ├── business_images (BIM)
    │   ├── business_category_map (BCM) → categories (CAT)
    │   └── promotions (PRM)
    │
    ├── events (EVT) [submitted_by]
    │   └── event_images (EIM)
    │
    └── attractions (ATR) [submitted_by]
        └── attraction_images (AIM)

locations (LOC)
    ├── businesses (BUS) [location_id]
    ├── events (EVT) [location_id]
    └── attractions (ATR) [location_id]
```

---

# 3. Sistema de Autenticación (AuthStore)

## 3.1 Descripción General

`authStore` es el **store global de autenticación**, construido con Zustand. Es la **única fuente de verdad** para el estado de autenticación.

**Archivo:** `src/store/authStore.ts`

## 3.2 Estado (AuthState)

```typescript
interface AuthState {
  user: User | null;              // Usuario de Supabase
  role: UserRole | null;          // Rol del perfil
  isLoading: boolean;             // Loading visible
  isAuthenticated: boolean;       // ¿Autenticado?
  _initialized: boolean;          // ¿Listener registrado?
  _isLoadingData: boolean;        // ¿Carga en curso?
}
```

## 3.3 Acciones Principales

### `initialize(): void`
**Ejecutar UNA SOLA VEZ al inicio** en `app/_layout.tsx`:

1. Previene reinicializaciones
2. Registra `onAuthStateChange` listener
3. Carga datos iniciales con `loadUserData()`

### `loadUserData(): Promise<void>`
Carga completa del usuario autenticado:

1. Verifica protección contra cargas simultáneas
2. Consulta sesión: `getSession()`
3. Valida token: `getUser()` con timeout 10s
4. Carga perfil desde tabla `profiles`
5. Manejo de errores robusto

**IMPORTANTE:** Esta función es llamada automáticamente por el listener. NO llamar manualmente.

### `signOut(): Promise<void>`
Cierra sesión:

1. Llama a `supabase.auth.signOut()`
2. Limpia todo el estado local
3. Fail-safe: limpia incluso si hay error

### `cleanup(): void`
Limpia recursos al desmontar:

1. Desuscribe listener
2. Resetea flags internos

## 3.4 Flujo de Autenticación

### Inicio de la App

```
App Mount
   │
   ├─→ _layout.tsx ejecuta initialize()
   │      │
   │      ├─→ Registra onAuthStateChange listener
   │      └─→ Llama loadUserData()
   │
   └─→ app/index.tsx lee el estado:
          ├─→ isLoading → ActivityIndicator
          ├─→ isAuthenticated → /(app)/(tabs)/home
          └─→ !isAuthenticated → /(auth)/login
```

### Login

```
LoginScreen
   │
   ├─→ authService.signIn(email, password)
   │      │
   │      └─→ supabase.auth.signInWithPassword()
   │
   ├─→ [LISTENER] Detecta SIGNED_IN
   │      │
   │      └─→ Ejecuta loadUserData() automáticamente
   │
   └─→ router.replace('/(app)/(tabs)/home')
```

**IMPORTANTE:** El `LoginScreen` NO llama `loadUserData()` manualmente.

### Logout

```
UserMenu
   │
   ├─→ authStore.signOut()
   │      │
   │      ├─→ supabase.auth.signOut()
   │      └─→ Limpia estado
   │
   └─→ router.replace('/(auth)/login')
```

## 3.5 Uso en Componentes

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

### Selectores Optimizados

```typescript
// ❌ MAL: Re-renderiza en cualquier cambio
const store = useAuthStore();

// ✅ BIEN: Solo re-renderiza si cambia user.email
const userEmail = useAuthStore((state) => state.user?.email);
```

## 3.6 Prevención de Race Conditions

**Problemas resueltos:**
1. Flag `_isLoadingData` separado previene cargas simultáneas
2. Listener registrado ANTES de `loadUserData()`
3. LoginScreen confía en el listener (no llama manual)
4. Store como única fuente de verdad

---

# 4. Sistema de Temas (Dark Mode)

## 4.1 Resumen Ejecutivo

- ✅ Modo light/dark con soporte para modo automático
- ✅ Persistencia de preferencias con AsyncStorage
- ✅ Colores dinámicos que responden al cambio
- ✅ Animaciones suaves en transiciones
- ✅ Cross-platform (iOS, Android, Web)
- ✅ 35+ componentes actualizados
- ✅ Paleta GitHub-inspired para legibilidad

## 4.2 Arquitectura

```
src/
├── store/
│   └── themeStore.ts          # Store Zustand con persistencia
├── hooks/
│   ├── useThemedColors.ts     # Hook principal
│   ├── use-color-scheme.ts    # Detección (mobile)
│   └── use-color-scheme.web.ts # Detección (web)
├── styles/
│   └── theme/
│       ├── colors.ts          # Paleta light/dark
│       ├── spacing.ts
│       └── typography.ts
└── components/
    └── layout/Header/ThemeToggle/
```

## 4.3 Paleta Dark Mode

**Colores Base:**
- Background primario: `#0d1117` (Negro profundo)
- Background secundario: `#161b22`
- Background terciario: `#21262d`
- Texto primario: `#e6edf3` (Blanco brillante)
- Texto secundario: `#8b949e`
- Texto terciario: `#6e7681`
- Bordes: `#30363d` / `#3d444d` / `#484f58`
- Accent: `#58a6ff` (Azul brillante)

**Ventajas:**
- ✅ Alto contraste WCAG AAA
- ✅ Reduce fatiga visual
- ✅ Inspirada en GitHub Dark / VS Code

## 4.4 useThemedColors Hook

**Retorna:**
```typescript
{
  background: {
    primary: string,
    secondary: string,
    tertiary: string,
  },
  text: {
    primary: string,
    secondary: string,
    tertiary: string,
    inverse: string,
  },
  border: {
    light: string,
    medium: string,
    dark: string,
  },
  primary: { 50, 100, ..., 900 },
  success: string,
  warning: string,
  error: string,
  info: string,
  theme: 'light' | 'dark',
  isDark: boolean,
}
```

## 4.5 Uso en Componentes

```typescript
import { useThemedColors } from '@/hooks';

export const MyComponent = () => {
  const colors = useThemedColors();
  
  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>
        Hola Mundo
      </Text>
    </View>
  );
};
```

## 4.6 Mejores Prácticas

### ✅ Correcto:
```typescript
const colors = useThemedColors();
backgroundColor: colors.background.primary
```

### ❌ Incorrecto:
```typescript
import { colors } from '@/styles/theme';
backgroundColor: colors.background.primary // No cambia con tema
```

### Excepciones Permitidas:
```typescript
// ✅ OK - Rating stars siempre amarillos
<Star color="#fbbf24" fill="#fbbf24" />

// ✅ OK - Iconos sobre fondos fijos
<View style={{ backgroundColor: colors.primary[500] }}>
  <User color="#fff" size={20} />
</View>
```

---

# 5. Tab Gestionar - Hub por Rol

## 5.1 Descripción General

El Tab "Gestionar" es un HUB centralizado que muestra funcionalidades según el rol del usuario. No es un listado, sino un dashboard con cards de acceso rápido.

## 5.2 Roles y Permisos

### No Autenticado (null user)
- **Vista:** Pantalla CTA centrada
- **Mensaje:** "Inicia sesión para gestionar"
- **Acción:** Botón → `/(auth)/login`

### Buyer
- ✅ Gestionar Eventos
- ✅ Gestionar Atracciones
- ❌ Negocios (oculto)
- ❌ Promociones (oculto)
- ❌ Admin (oculto)

### Seller
- ✅ Gestionar Eventos
- ✅ Gestionar Atracciones
- ✅ Gestionar Negocios
- ✅ Gestionar Promociones
- ❌ Admin (oculto)

### Admin
- ✅ Gestionar Eventos
- ✅ Gestionar Atracciones
- ✅ Gestionar Negocios
- ✅ Gestionar Promociones
- ✅ Panel de Administración (especial)

## 5.3 Componentes Principales

### ManageCard

Props:
- `title: string`
- `description: string`
- `icon: ReactNode`
- `onPress: () => void`
- `variant?: 'default' | 'admin'`
- `badgeText?: string`

**Características:**
- Animación spring scale 0.97
- 2 columnas en ≥380px
- Contraste mejorado light mode
- Variant admin con LinearGradient

### RequireRole (Guard)

Props:
- `allowedRoles: readonly UserRole[]`
- `redirectTo?: string`
- `requireAuth?: boolean`

**Protege rutas sensibles:**
```typescript
<RequireRole allowedRoles={['seller', 'admin']}>
  <ManageBusinessesScreen />
</RequireRole>
```

## 5.4 Seguridad

Todas las rutas en `manage/` protegidas:
- `admin.tsx` → Solo admin
- `businesses.tsx` → seller + admin
- `promotions.tsx` → seller + admin
- `events.tsx` → todos autenticados
- `attractions.tsx` → todos autenticados

---

# 6. Verificación de Modelo BD vs Código

## 6.1 Estado de Implementación

### ✅ Tabla `businesses` (BUS)

**Campos activos (9):**
- id_bus, owner_id_bus, name_bus, description_bus
- location_id_bus, social_links_bus, contact_phone_bus
- contact_email_bus, website_bus

**Campos pendientes (5):**
- moderation_status_bus, reviewed_by_bus, reviewed_at_bus
- moderation_note_bus (workflow de moderación futuro)
- avg_rating_bus, reviews_count_bus (sistema de reviews futuro)

**Campos auto (2):**
- created_at_bus, updated_at_bus

### ✅ Tabla `business_images` (BIM)

**Todos los campos implementados (100%):**
- id_bim, business_id_bim, image_type_bim
- bucket_bim, path_bim, sort_order_bim, created_at_bim

**Lógica de imágenes:**
- Logo: 1 (sort_order = 0)
- Cover: 1 (sort_order = 1)
- Gallery: 4 (sort_order = 2,3,4,5)
- **Total: 6 imágenes máximo**

### ✅ Tabla `locations` (LOC)

**Todos los campos implementados (100%):**
- id_loc, country_loc ✅ (agregado), province_loc
- canton_loc, district_loc, address_loc
- latitude_loc, longitude_loc, created_at_loc

### ✅ Tabla `business_category_map` (BCM)

**Todos los campos (100%):**
- business_id_bcm, category_id_bcm

### ✅ Tabla `categories` (CAT)

**Todos los campos (100%):**
- id_cat, name_cat, created_at_cat

**Uso de Categorías (Sistema Centralizado):**

La tabla `categories` es compartida por todas las entidades (business, events, attractions, products, promotions). Usar siempre el sistema centralizado:

```typescript
// Hook para obtener categorías
import { useCategories } from '@/hooks/useCategories';
const { data: categories = [] } = useCategories(); // CategoryItem[]

// Servicio para queries manuales
import { getCategories } from '@/services/categories.service';
const categories = await getCategories(); // CategoryItem[]

// Tipos
import { Category, CategoryItem } from '@/types/entities';
// Category: formato BD {id_cat, name_cat}
// CategoryItem: formato UI {id, name}
```

**IMPORTANTE**: Siempre usar columnas en minúsculas (`id_cat`, `name_cat`) en queries de BD.

## 6.2 Implementación de Imágenes

### Eliminación Correcta de Imágenes

**Logo y Cover:**
```typescript
// Siempre eliminar archivo del bucket antes de actualizar registro
await supabase.storage.from('business-images').remove([path]);
await supabase.from('business_images').delete().eq('id_bim', id);
```

**Gallery (Selectiva):**
```typescript
// Comparar URLs existentes vs nuevas para eliminar solo las removidas
const imagesToDelete = currentGallery.filter(img => 
    !existingGalleryUrls.includes(getImageUrl(img))
);
```

### Ubicaciones Compartidas

```typescript
// Solo eliminar location si no la usa otro negocio
const { count } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('location_id_bus', locationId);

if (count === 0) {
    await supabase.from('locations').delete().eq('id_loc', locationId);
}
```

---

# 7. Gestión de Imágenes y Storage

## 7.1 Estructura de Buckets

### business-images
- **Path:** `{businessId}/{tipo}-{timestamp}-{random}.{ext}`
- **Ejemplo:** `abc123-def456/logo-1705612800-xyz789.jpg`

### event-images
- **Path:** `{eventId}/{tipo}-{timestamp}-{random}.{ext}`

### Políticas RLS de Storage

**Configuración actual:**
```sql
-- DELETE (business-images)
bucket_id = 'business-images'
AND (storage.foldername(name))[1] IN (
    SELECT id_bus::text 
    FROM businesses 
    WHERE owner_id_bus = auth.uid()
)
```

**Requisitos:**
- Usuario autenticado: `auth.uid()` no null
- Propietario del negocio
- Path correctamente estructurado

## 7.2 Servicios de Imágenes

### createBusiness.service.ts
**Funciones:**
- `uploadImage(uri, businessId, type, sortOrder)`
- Sube a bucket + inserta registro BD
- Maneja blob (web) y file:// (mobile)

### updateBusiness.service.ts
**Funciones:**
- `handleImageUpdates(businessId, data)`
- **Logo/Cover:** Elimina viejo, sube nuevo
- **Gallery:** Elimina selectiva, preserva existentes

### userBusinesses.service.ts
**Funciones:**
- `deleteUserBusiness(businessId, userId)`
- Elimina archivos individuales
- Fallback: elimina carpeta completa
- Logging robusto

## 7.3 Helpers

### isNewImage(uri: string)
```typescript
// Detecta si es imagen nueva o URL de Supabase
return uri.startsWith('file://') || 
       uri.startsWith('blob:') || 
       uri.startsWith('data:');
```

### getImageUrl(bucket: string, path: string)
```typescript
const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
return data.publicUrl;
```

## 7.4 Flujo de Actualización

```
Usuario edita negocio
   │
   ├─→ Logo nuevo → Elimina viejo del bucket + BD → Sube nuevo
   │
   ├─→ Cover nuevo → Elimina viejo del bucket + BD → Sube nuevo
   │
   └─→ Gallery cambia:
          ├─→ Mantiene URLs existentes (no toca)
          ├─→ Elimina las que se quitaron
          └─→ Sube las nuevas
```

## 7.5 Diagnóstico de Problemas

### Si las imágenes no se eliminan:

1. **Verificar autenticación:**
```typescript
const { data: user } = await supabase.auth.getUser();
console.log('Usuario:', user.user?.id);
```

2. **Verificar políticas de Storage:**
```sql
-- Ver políticas de DELETE
SELECT policyname, roles, qual 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND cmd = 'DELETE';
```

3. **Verificar path del archivo:**
```typescript
console.log('Path a eliminar:', image.path_bim);
// Debe ser: "businessId/tipo-timestamp-random.ext"
```

4. **Verificar ownership:**
```sql
SELECT id_bus, owner_id_bus 
FROM businesses 
WHERE id_bus = 'BUSINESS-ID-AQUI';
```

---

## 📞 Contacto y Soporte

Para consultas sobre esta documentación:
- Revisa los archivos fuente en `src/`
- Verifica los tipos en `src/types/entities/`
- Consulta las policies en Supabase Dashboard

**Última revisión:** 17 de enero de 2026
