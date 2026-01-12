# Migración del Sistema de Ubicaciones a Supabase

## 📋 Resumen

Se migró el sistema de ubicaciones de datos estáticos locales (`costaRica.ts`) a una base de datos dinámica en Supabase, implementando un store global con Zustand para gestión de estado optimizada.

## 🎯 Cambios Realizados

### 1. Nuevo Servicio de Datos (locationDataService.ts)
- **Ubicación:** `src/features/maps/services/locationDataService.ts`
- **Función:** Consulta la tabla `locations` en Supabase
- **Procesamiento:** Agrupa datos de BD en estructuras usables (Province, Canton, District)
- **Características:**
  - Sin reintentos automáticos (falla rápidamente)
  - Manejo robusto de errores
  - Ordenamiento alfabético

### 2. Store Global de Ubicaciones (locationDataStore.ts)
- **Ubicación:** `src/store/locationDataStore.ts`
- **Tecnología:** Zustand
- **Características:**
  - Caché en memoria (carga única al iniciar)
  - Estados: `isLoading`, `hasError`, `isLoaded`
  - Método `refreshLocations()` para recarga manual
  - Selectores optimizados para reactividad

### 3. Hook Actualizado (useLocationFilters.ts)
- **Cambio:** Migrado de datos estáticos a store global
- **Nuevos valores retornados:** `isLoading`, `hasError`, `hasData`
- **Optimización:** Uso de selectores individuales de Zustand para mejor rendimiento

### 4. Componente UI Mejorado (LocationSearchBar.tsx)
- **Estados visuales:**
  - Loader mientras carga
  - Mensaje "Sin ubicación" si falla
  - Lista completa si carga exitosamente
- **Manejo de errores:** UI degradada graciosamente

### 5. Componente de Debug (LocationDataDebug.tsx)
- **Nuevo archivo:** `src/components/ui/LocationDataDebug/LocationDataDebug.tsx`
- **Uso:** Pantallas de desarrollo/configuración
- **Muestra:**
  - Estadísticas de datos cargados
  - Estados del sistema
  - Botón de refresh manual

### 6. Tipos Actualizados (location.ts)
- **Agregados:** `Province`, `Canton`, `District`
- **Corrección:** Nombres de columnas en minúsculas (`_loc` en lugar de `_LOC`)

### 7. Inicialización de App (_layout.tsx)
- **Cambio:** Agregada carga de ubicaciones al iniciar
- **Código:**
  ```typescript
  const { loadLocations } = useLocationDataStore.getState();
  loadLocations();
  ```

## 🔧 Estructura de Base de Datos

### Tabla: `locations`
```sql
- id_loc          : uuid
- country_loc     : text
- province_loc    : text
- canton_loc      : text
- district_loc    : text
- address_loc     : text
- latitude_loc    : float
- longitude_loc   : float
- created_at_loc  : timestamp
```

**Nota:** Todas las columnas usan sufijo en minúsculas `_loc`

## 🚀 Flujo de Ejecución

```
1. App inicia (app/_layout.tsx)
   ↓
2. loadLocations() se ejecuta
   ↓
3. LocationDataService consulta Supabase
   ↓
4. Datos procesados y guardados en store
   ↓
5. Componentes acceden vía useLocationDataStore
```

## 💡 Mejoras de Rendimiento

1. **Caché en Memoria:** Una sola consulta a Supabase por sesión
2. **Selectores Optimizados:** Uso de selectores individuales en lugar de destructuring masivo
3. **Carga Única:** No recarga datos innecesariamente
4. **Refresh Manual:** Control explícito para recarga

## 🐛 Problemas Solucionados

### Problema 1: Nombres de Columnas
- **Error:** `column locations.province_LOC does not exist`
- **Causa:** Columnas en BD usan minúsculas (`_loc`) no mayúsculas (`_LOC`)
- **Solución:** Actualizado tipo `Location` y queries

### Problema 2: Getters Computados de Zustand
- **Error:** Valores no se actualizaban con destructuring
- **Causa:** Getters computados no son reactivos con destructuring
- **Solución:** Cambiado a selectores individuales

### Problema 3: UI Mostrando "Sin ubicación"
- **Causa:** `hasData` no se actualizaba correctamente
- **Solución:** Cálculo local de `hasData` en el hook

## 📦 Archivos Modificados

### Creados
- `src/features/maps/services/locationDataService.ts`
- `src/store/locationDataStore.ts`
- `src/components/ui/LocationDataDebug/LocationDataDebug.tsx`
- `src/components/ui/LocationDataDebug/index.ts`

### Modificados
- `src/hooks/useLocationFilters.ts`
- `src/components/ui/LocationSearchBar/LocationSearchBar.tsx`
- `src/components/ui/LocationSearchBar/styles.ts`
- `src/types/entities/location.ts`
- `src/types/entities/index.ts`
- `src/store/index.ts`
- `src/features/maps/services/index.ts`
- `src/components/ui/index.ts`
- `app/_layout.tsx`

## 🎨 Uso

### Acceder a Ubicaciones
```typescript
const provinces = useLocationDataStore((s) => s.provinces);
const isLoading = useLocationDataStore((s) => s.isLoading);
const hasError = useLocationDataStore((s) => s.hasError);
```

### Refrescar Datos
```typescript
const refreshLocations = useLocationDataStore((s) => s.refreshLocations);
await refreshLocations();
```

### Componente de Selector
```typescript
<LocationSearchBar 
  onLocationChange={(selection) => {
    // Maneja selección
  }}
/>
```

## ⚠️ Consideraciones

1. **Sin Fallback:** Si falla Supabase, no hay datos de respaldo
2. **RLS:** Asegúrate de que las políticas de Supabase permitan lectura pública de `locations`
3. **Permisos:** Tabla debe ser accesible con clave anónima

## ✅ Estado Final

- ✅ Sin errores de TypeScript
- ✅ Logs de debug eliminados
- ✅ Código optimizado
- ✅ Componentes funcionando correctamente
- ✅ Caché implementado
- ✅ Manejo de errores robusto
