# Tab Gestionar - Hub de Gestión por Rol

**Fecha de implementación:** 13 de enero de 2026  
**Versión:** 1.0.0

## Descripción General

El Tab "Gestionar" es un HUB de gestión centralizado que muestra diferentes funcionalidades según el rol del usuario autenticado. No es un listado de datos, sino un dashboard con cards de acceso rápido a diferentes áreas de administración.

## Arquitectura de Componentes

### Ubicación de archivos

```
src/
  components/
    manage/
      ManageCard/
        ManageCard.tsx
        styles.ts
        index.ts
      GuestCTA/
        GuestCTA.tsx
        styles.ts
        index.ts
      index.ts
  features/
    auth/
      guards/
        RequireRole.tsx
    manage/
      screens/
        ManageScreen/
          ManageScreen.tsx
          styles.ts
          index.ts
        ManagePlaceholderScreen/
          ManagePlaceholderScreen.tsx
          styles.ts
          index.ts
        index.ts
app/
  (app)/
    (tabs)/
      manage/
        index.tsx
        _layout.tsx
        events.tsx
        attractions.tsx
        businesses.tsx
        promotions.tsx
        admin.tsx
```

## Roles y Permisos

### Tipos de Usuario

#### 1. No Autenticado (null user)
- **Vista:** Pantalla CTA centrada
- **Mensaje:** "Inicia sesión para gestionar"
- **Beneficios mostrados:**
  - Publica y edita negocios
  - Crea promociones para atraer clientes
  - Administra eventos y atracciones
- **Acción:** Botón "Iniciar sesión" → redirige a `/(auth)/login`

#### 2. Buyer
- **Cards visibles:**
  - ✅ Gestionar Eventos
  - ✅ Gestionar Atracciones
- **Cards ocultas:**
  - ❌ Gestionar Negocios
  - ❌ Gestionar Promociones
  - ❌ Panel de Administración

#### 3. Seller
- **Cards visibles:**
  - ✅ Gestionar Eventos
  - ✅ Gestionar Atracciones
  - ✅ Gestionar Negocios
  - ✅ Gestionar Promociones
- **Cards ocultas:**
  - ❌ Panel de Administración

#### 4. Admin
- **Cards visibles:**
  - ✅ Gestionar Eventos
  - ✅ Gestionar Atracciones
  - ✅ Gestionar Negocios
  - ✅ Gestionar Promociones
  - ✅ Panel de Administración (estilo especial)

## Componentes Principales

### 1. ManageCard

Componente reutilizable para mostrar cada opción de gestión.

**Props:**
- `title: string` - Título de la card
- `description: string` - Descripción breve
- `icon: ReactNode` - Ícono (de lucide-react-native)
- `onPress: () => void` - Callback al presionar
- `variant?: 'default' | 'admin'` - Variante visual (admin usa LinearGradient)
- `badgeText?: string` - Badge opcional (ej: "Admin")

**Características:**
- Animación spring scale 0.97 al presionar
- Dos variantes: default (card normal) y admin (gradient verde)
- Responsive: 2 columnas en pantallas ≥ 380px, 1 columna en móviles
- Contraste mejorado en light mode (background.secondary + shadows.xl)
- Sin colores hardcodeados: todo usa `useThemedColors()`

### 2. GuestCTA

Pantalla de bienvenida para usuarios no autenticados.

**Props:**
- `title?: string`
- `subtitle?: string`
- `ctaLabel?: string`
- `onPressLogin?: () => void`

**Características:**
- Centrada vertical y horizontalmente
- Ilustración con icono Sparkles
- Lista de beneficios con bullets
- Botón CTA principal

### 3. ManagePlaceholderScreen

Pantalla placeholder para funcionalidades en desarrollo.

**Props:**
- `title: string`
- `description: string`
- `icon?: ReactNode`

**Características:**
- Alineada arriba (no centrada verticalmente)
- Centrada horizontalmente con maxWidth 860px
- Dos botones en fila: "Volver" + "Ir a Home"
- Badge "Próximamente"

### 4. RequireRole (Guard)

Componente de seguridad para proteger rutas sensibles.

**Props:**
- `allowedRoles: readonly UserRole[]` - Roles permitidos
- `redirectTo?: string` - Destino de redirección (default: Home)
- `requireAuth?: boolean` - Si requiere sesión activa (default: true)

**Funcionamiento:**
- Verifica `user` y `role` desde `useAuthStore`
- Si no cumple requisitos → redirect automático
- Retorna `null` mientras redirige (no muestra contenido)
- Usado en todas las rutas de `manage/` para proteger acceso

## Seguridad

### Protección de Rutas

Todas las rutas dentro de `app/(app)/(tabs)/manage/` están protegidas con `RequireRole`:

```tsx
// Ejemplo: admin.tsx (SOLO admin)
<RequireRole allowedRoles={['admin']} redirectTo="/(app)/(tabs)/home">
  <ManagePlaceholderScreen ... />
</RequireRole>

// Ejemplo: businesses.tsx (seller + admin)
<RequireRole allowedRoles={['seller', 'admin']} redirectTo="/(app)/(tabs)/home">
  <ManagePlaceholderScreen ... />
</RequireRole>
```

### Renderizado Condicional

En `ManageScreen.tsx`, las cards se filtran por rol:

```typescript
const effectiveRole: UserRole = normalizedRole ?? 'buyer';

const visibleActions = actions.filter((action) => {
  if (action.key === 'admin') {
    return effectiveRole === 'admin'; // Admin SOLO para admin
  }
  return action.roles.includes(effectiveRole);
});
```

## Diseño UI/UX

### Layout Responsive

- **Mobile (<380px):** 1 columna
- **Tablet/Desktop (≥380px):** 2 columnas
- **MaxWidth:** 860px para evitar cards muy anchas en pantallas grandes

### Contraste y Temas

#### Light Mode
- Cards: `background.secondary` + `border.medium` + `shadows.xl`
- Iconos: `background.primary` con borde visible

#### Dark Mode
- Cards: `background.primary` + `border.light` + `shadows.lg`
- Iconos: `background.tertiary`

#### Admin Card (Variante Especial)
- **Dark:** Gradient de `primary[800]` → `primary[600]`
- **Light:** Gradient de `primary[700]` → `primary[500]`
- Ícono visible con `colors.text.primary` (no `text.inverse` que se perdía)
- Badge "Admin" con estilo distintivo

### Animaciones

- **Press:** Spring animation scale 0.97 (friction: 8, tension: 120)
- **Opacity:** 0.98 durante el press para feedback visual

## Estado y Datos

### Store utilizado

```typescript
import { useAuthStore } from '@/store';

const user = useAuthStore((state) => state.user);
const role = useAuthStore((state) => state.role);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### Normalización de Roles

Se implementó normalización para evitar errores por espacios/mayúsculas:

```typescript
function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'buyer' || normalized === 'seller' || normalized === 'admin') {
    return normalized;
  }
  return null;
}
```

## Rutas de Navegación

### Estructura

```
/(app)/(tabs)/manage/
  ├── index           (Hub principal)
  ├── events          (Gestionar Eventos - buyer/seller/admin)
  ├── attractions     (Gestionar Atracciones - buyer/seller/admin)
  ├── businesses      (Gestionar Negocios - seller/admin)
  ├── promotions      (Gestionar Promociones - seller/admin)
  └── admin           (Panel Admin - SOLO admin)
```

### Stack Navigator

El tab usa un Stack de Expo Router:

```tsx
// app/(app)/(tabs)/manage/_layout.tsx
<Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" />
  <Stack.Screen name="events" />
  <Stack.Screen name="attractions" />
  <Stack.Screen name="businesses" />
  <Stack.Screen name="promotions" />
  <Stack.Screen name="admin" />
</Stack>
```

## Próximos Pasos

### Funcionalidades Pendientes

1. **Gestionar Eventos**
   - CRUD de eventos
   - Calendario de eventos
   - Gestión de asistencia

2. **Gestionar Atracciones**
   - CRUD de atracciones
   - Categorización
   - Galería de imágenes

3. **Gestionar Negocios**
   - CRUD de negocios (seller)
   - Verificación de negocios (admin)
   - Gestión de categorías

4. **Gestionar Promociones**
   - CRUD de promociones
   - Vigencia y caducidad
   - Estadísticas de visualización

5. **Panel de Administración**
   - Dashboard de métricas
   - Gestión de usuarios
   - Moderación de contenido
   - Logs del sistema

### Mejoras Sugeridas

- [ ] Añadir animaciones de transición entre screens
- [ ] Implementar skeleton loaders durante carga
- [ ] Añadir tooltips informativos en cada card
- [ ] Estadísticas rápidas en cada card (ej: "5 eventos activos")
- [ ] Búsqueda/filtros en el hub si crece el número de opciones
- [ ] Notificaciones/badges en cards con items pendientes

## Notas Técnicas

### Patrón de Arquitectura

Todos los componentes siguen la estructura:
```
ComponentName/
  ├── ComponentName.tsx
  ├── styles.ts
  └── index.ts
```

### Exports

Los barrels (`index.ts`) exportan usando:
```typescript
export { ComponentName, type ComponentNameProps } from './ComponentName';
```

### Estilos

- `StyleSheet.create()` en archivos `styles.ts` separados
- `export default styles;` para import consistente
- No inline `StyleSheet` dentro de componentes
- Colores dinámicos via `useThemedColors()` (no hardcoded)

### Testing

**Importante:** Para testing, usar `testID` en ManageCard:
```tsx
<ManageCard testID="manage-events-card" ... />
```

## Troubleshooting

### Problema: Cards no visibles en light mode
**Solución:** Ya corregido. Se aumentó contraste usando `background.secondary` + `border.medium` + `shadows.xl`

### Problema: Ícono Admin no se ve
**Solución:** Ya corregido. Se cambió de `text.inverse` a `text.primary` para garantizar contraste en dark/light

### Problema: Tab "gestionar" duplicado
**Solución:** Ya corregido. Se eliminó el registro en `_layout.tsx` del tab raíz

### Problema: Usuario con rol null no ve nada
**Solución:** Ya corregido. Se normaliza rol y se usa `'buyer'` por defecto (mínimos permisos)

## Contacto y Mantenimiento

Para preguntas sobre esta funcionalidad, revisar:
- `src/features/manage/screens/ManageScreen/ManageScreen.tsx` (lógica principal)
- `src/components/manage/ManageCard/ManageCard.tsx` (componente reutilizable)
- `src/features/auth/guards/RequireRole.tsx` (seguridad)
