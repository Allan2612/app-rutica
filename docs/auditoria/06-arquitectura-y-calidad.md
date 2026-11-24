# 06 · Arquitectura y calidad de código

> Auditoría 2026-10-15 · ~93k líneas TS/TSX en 1.237 archivos (`app/` + `src/`).

---

## A1 🟠 Duplicación masiva por copia y pega entre entidades

La app tiene 4 entidades (negocio, atracción, evento, producto) que comparten casi toda la lógica, y cada una tiene su propia copia:

| Lógica | Copias aproximadas |
|---|---|
| Servicio de reseñas (`get/create/update/delete` + `update*Rating` + fallback) | 4 × ~350 líneas (`src/services/*Reviews.service.ts`) |
| Servicio de likes de reseñas | 3 |
| Hooks de reseñas + likes + toggle | 4 × 3-4 archivos |
| Subida de imágenes con `atob` + bucle de bytes | 11 archivos |
| `generateUUID()` con `Math.random` | 9 |
| `getImageTypeFromPath()` / `getImageType` | 8 |
| Armado de `locationLabel` (provincia, cantón, distrito) | 15 |
| `mapBusinessRecord` / `mapBusinessToListItem` | 2 idénticos (`home.service.ts` y `useBusinesses.ts`) |
| `useBusinessForm` frente a `useCreateBusinessForm` | ~300 líneas distintas de 420 |
| Componentes duplicados | `MapBackground` (ui y maps), `TikTokIcon` (ui y business), `ContactSection` (business y manage), `ReviewsList`/`ReviewItem` por entidad |

Por esta duplicación los bugs aparecen en unas copias y en otras no: los productos no tienen moderación, el home no filtra `null` en el nombre del autor y el listado sí, solo un servicio dice "el trigger lo hace".

**Recomendación:**
- Una fábrica `createReviewsApi({ table, idCol, fkCol, ratingRpc, likesTable })` y hooks genéricos `useReviews(entity, id)`.
- `src/lib/storage/uploadImage.ts`, `src/lib/ids.ts`, `src/utils/location.ts#formatLocationLabel`.
- Un **mapper por entidad**, en un solo lugar, usado por listado, home y detalle.

---

## A2 🟠 Tipos de BD desactualizados y anulados

- `database.types.ts` no refleja producción: columnas como `whatsapp_phone_bus`, `payment_state_prm` y `subscription_id_psub`, y RPCs `update_*_rating`.
- Hay 96 `supabase as any` y decenas de `(data as any).campo`. `tsc` pasa con **0 errores**, pero solo porque el tipado está desactivado donde importa.
- `docs/base-de-datos/esquema-v3.sql` tampoco refleja producción (ver S6).

**Recomendación:** `supabase gen types` como script de npm (`"db:types"`), migraciones en `supabase/migrations/` y CI que falle si los tipos cambian sin commit.

---

## A3 🟠 Manejo de errores inconsistente

Conviven cuatro contratos distintos: `throw`, `return []`, `return null` y `return false`, más `console.error` y seguir. El mismo tipo de operación (por ejemplo "crear reseña") lanza en negocios y devuelve `false` en productos.

**Recomendación:** que los servicios **lancen siempre** (con `AppError` y un código traducible) y que la UI decida. Agregar un `ErrorBoundary` en el root, que hoy **no existe**: un crash de render deja la pantalla en blanco. Sumar reporte de crashes (Sentry o `expo-insights`).

---

## A4 🟡 Estructura de carpetas mezclada

- Hay servicios en `src/services/` (reseñas, cuotas, dashboard) **y** en `src/features/*/services/`, sin criterio claro.
- Los tipos de dominio se definen dentro de hooks (`BusinessListItem` en `useBusinesses.ts`) y los servicios los importan (`home.service.ts` importa tipos de hooks), lo que invierte la dependencia.
- `features/user/` tiene pantallas sueltas (`TermsScreen/`, `SettingsScreen/`) mientras otras features usan `screens/`.
- `HomeScreen` importa `'../../../../components/home'`, aunque `DOCUMENTACION_COMPLETA.md` pide usar siempre `@/`.

---

## A5 🟡 Sin red de seguridad

| Herramienta | Estado |
|---|---|
| Tests (unitarios / e2e) | **Ninguno** |
| ESLint | **No configurado** (hay `// eslint-disable` en el código, pero ningún `.eslintrc`) |
| CI | No hay `.github/workflows` |
| `.env.example` | No existe. `client.ts` usa `process.env.EXPO_PUBLIC_SUPABASE_URL!` y, si falta, la app crashea con un error poco claro. |
| Prettier | ✅ `.prettierrc` |
| TypeScript strict | ✅, pero anulado con `any` (A2) |

**Recomendación mínima:**
1. ESLint con `eslint-config-expo` + `react-hooks/exhaustive-deps`. Habría detectado B3 y varios `useMemo` con dependencias incompletas (por ejemplo `MapScreen.mapHTML`).
2. Tests unitarios (Jest) de las funciones puras de mayor riesgo: `contentModeration`, `promotionHelpers.calculateDiscountedPrice`, `splitItemsByLocation`, mappers.
3. Un workflow de GitHub Actions con `tsc --noEmit` + lint + tests.
4. `.env.example` y validación de variables al arrancar.

---

## A6 🟡 Navegación con `setTimeout`

Hay 30 `setTimeout`, muchos del tipo "mostrar toast y navegar en 500 ms". Si el usuario sale antes, la navegación ocurre igual, desde una pantalla desmontada. El Toast es global, así que se puede navegar de inmediato.

---

## A7 🟢 Configuración de builds

- `eas.json` usa `appVersionSource: "local"` sin `autoIncrement`, y `app.json` tiene `version: 1.0.0` sin `android.versionCode` ni `ios.buildNumber`. Cada build de producción hay que subirla a mano, o Play Store la rechaza.
- `app.json` usa `userInterfaceStyle: "light"` (ver U20).
- `newArchEnabled` no está declarado (en SDK 54 viene activado por defecto). Conviene confirmar que `react-native-reanimated-carousel@4.0.0-alpha` y `react-native-gifted-charts` sean compatibles. Hay una versión **alpha** en producción.

---

## A8 🟢 Documentación existente

`docs/DOCUMENTACION_COMPLETA.md` (enero 2026) y `docs/MANAGE_STANDARDS.md` describen estándares que el código no siempre sigue (imports con `@/`, estructura de carpetas), y un modelo de BD que no es el de producción. Conviene marcarlos como desactualizados o regenerar la sección de BD desde las migraciones.
