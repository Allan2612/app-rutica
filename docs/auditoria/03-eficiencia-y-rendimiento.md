# 03 · Eficiencia y rendimiento

> Auditoría 2026-10-15
> Severidad: 🔴 crítico · 🟠 alto · 🟡 medio · 🟢 bajo

---

## E1 🔴 Refetch de todo en cada cambio de tab

Tres mecanismos se suman:

1. [react-query/client.ts](../../src/lib/react-query/client.ts): `staleTime: 0` + `refetchOnWindowFocus` + `refetchOnMount` como default global.
2. `useRefreshOnFocus(refetch)` en **24 pantallas**. `refetch()` **ignora `staleTime`**: aunque una query declare `staleTime: 5 min` (home, eventos, mapa), igual se vuelve a pedir en cada foco.
3. Las queries de listado traen **todo** (ver [Q1](01-queries-y-base-de-datos.md#Q1)).

Ejemplo, un usuario que pasa de Home a Negocios, a Mapa y vuelve a Home:
- Home: 5 queries (8 requests HTTP con los `count`).
- Negocios: la lista completa con imágenes y categorías.
- Mapa: 3 queries de hasta 500 filas con `count: 'exact'`, **cuyo resultado se descarta** (ver E3).
- Home otra vez: las 8 requests de nuevo.

**Recomendación:**
- `staleTime` global de 60 s (o 2-5 min para catálogos) y `refetchOnWindowFocus: false` en nativo; ya hay `focusManager` para volver del background.
- Reemplazar `useRefreshOnFocus(refetch)` por una versión que solo refresque si la query está stale (`queryClient.refetchQueries({ queryKey, stale: true })`), o eliminarlo y confiar en `invalidateQueries` después de cada mutación (ya hay 111 `invalidateQueries`).
- Categorías, ubicaciones y planes de suscripción: `staleTime: Infinity` con invalidación manual.

---

## E2 🔴 N+1 en los feeds de atracciones y eventos

Cada `AttractionPost` y cada `EventPost` del feed monta `useAttractionPostReviews` → `useAttractionReviews` + `useUserAttractionReview` + 3 `useMutation`:

| Por cada post | Requests |
|---|---|
| `getAttractionReviews` | 1 (reseñas) + 1 (conteo de likes) + 1 (todos los likes del usuario) |
| `getUserAttractionReview` | 1 (mi reseña) + 1 (conteo de likes) + 1 (todos los likes del usuario, otra vez) |

Son **~6 requests por post** con sesión iniciada. Un feed de 30 atracciones genera unas **180 requests al abrir la pestaña**, y se repiten en cada foco (E1). Las reseñas se descargan aunque la sección esté colapsada (`showReviews=false`).

Cada post además monta **un `ReviewModal` y un `ConfirmDeleteDialog`** (con `Modal` nativo) aunque estén cerrados. En un feed largo son decenas de modales montados.

**Recomendación:**
- En el feed, `enabled: showReviews` en las queries de reseñas, para cargarlas solo al expandir.
- El conteo de reseñas y el rating ya vienen en la lista (`reviewCount`, `rating`). Usar esos valores para el contador.
- Un único `ReviewModal`/`ConfirmDeleteDialog` a nivel de pantalla, abierto con el id seleccionado.

---

## E3 🟠 Mapa: los marcadores se congelan, pero se siguen pidiendo

[MapScreen.tsx:34-49](../../src/features/maps/screens/MapScreen/MapScreen.tsx#L34-L49) guarda los primeros marcadores en `initialMarkersRef` y nunca los actualiza. Al mismo tiempo `useRefreshOnFocus(refetch)` vuelve a pedir las 3 queries (hasta 1500 filas y 3 `count: exact`) en cada foco, y **el resultado se ignora**. Un negocio aprobado mientras la app está abierta no aparece en el mapa hasta reiniciar.

Además:
- El HTML del mapa incluye todos los marcadores como JSON inline y carga Leaflet desde `unpkg.com` **en cada montaje** (no funciona sin conexión y no se cachea entre sesiones en WebView).
- `mapCoords` es un objeto nuevo en cada render cuando no hay coordenadas, lo que invalida el `useMemo` del HTML y **recarga el WebView**.
- Cambiar de tema regenera el HTML completo y recarga el mapa.

**Recomendación:** enviar los marcadores al WebView por `postMessage` (ya existe el canal para los filtros) en lugar de embeberlos en el HTML. Así se pueden actualizar sin recargar, y el HTML queda estático y memoizado una sola vez.

---

## E4 🟠 Re-renders globales por stores sin selector

- `useAuthStore()` **sin selector** en 25 lugares, entre ellos `BaseHeader` (en todas las tabs) y `AttractionPost` (en **cada ítem** del feed). En cada `TOKEN_REFRESHED` (aproximadamente cada hora) el store hace `set({ user: session.user })` con un objeto nuevo, y **todos los posts del feed se re-renderizan**.
- `useLocationStore()` sin selector en las pantallas principales.
- `useThemedColors()` se llama en casi todos los componentes (cientos de instancias). Cada instancia:
  - se suscribe al `themeStore` completo (sin selector),
  - ejecuta `useColorScheme` con 2 `useEffect` (y `loadTheme()` si no cargó),
  - construye su propio objeto de colores.

**Recomendación:**
- Selectores siempre: `useAuthStore(s => s.user?.id)`, o `useShallow` para varios campos.
- Tema: un `ThemeProvider` en el root que calcule los colores **una vez** y los exponga por contexto. `loadTheme()` se llama una vez en el arranque.

---

## E5 🟠 Subida de imágenes: memoria, tamaño y secuencialidad

[createBusiness.service.ts:66-85](../../src/features/business/services/createBusiness.service.ts#L66-L85) (patrón repetido en 11 archivos):

```ts
const base64Data = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
const byteCharacters = atob(base64Data);
const byteNumbers = new Array(byteCharacters.length);   // ← array de números JS
for (...) byteNumbers[i] = byteCharacters.charCodeAt(i);
const byteArray = new Uint8Array(byteNumbers);
```

Para una foto de 4 MB esto ocupa ≈ 5.3 MB (base64) + 4 MB (string binario) + **32 MB** (`Array` de números, 8 bytes por elemento) + 4 MB (`Uint8Array`), es decir **más de 45 MB de picos de memoria por imagen**. Puede cerrar la app en Android de gama baja.

Además:
- No se redimensiona ni comprime: `quality: 0.8` del picker no cambia la resolución (12 MP o más).
- Las subidas son **secuenciales** (`for … await`).
- `contentType: 'image/jpeg'` está fijo aunque el archivo sea PNG o HEIC.

**Recomendación:**
- `expo-image-manipulator`: redimensionar a 1600 px de lado mayor (cover/galería) o 512 px (logo/avatar) y JPEG o WebP al 0.75 **antes** de subir.
- Subir con `fetch(uri).then(r => r.arrayBuffer())` o `base64-arraybuffer` (`decode`), sin el `Array` intermedio.
- `Promise.all` con concurrencia de 3.
- Un solo helper `uploadImage(bucket, path, uri)` en `src/lib/storage`, en lugar de 11 copias.

---

## E6 🟠 Descarga de imágenes a tamaño original

- `getPublicUrl(path)` sin `transform` (28 usos). Las tarjetas de 300 px descargan el original de varios MB.
- 31 archivos usan `Image` de `react-native` (sin caché en disco en Android y sin placeholder) y 26 usan `expo-image`. Solo 6 usos de `cachePolicy`.

**Recomendación:**
- Supabase Image Transformations: `getPublicUrl(path, { transform: { width: 400, quality: 70 } })` para tarjetas y `width: 1200` para detalle (requiere plan Pro). Si no está disponible, generar thumbnails al subir (E5).
- Migrar todo a `expo-image` con `cachePolicy="memory-disk"`, `placeholder` (blurhash) y `recyclingKey` en listas.

---

## E7 🟠 Arranque en frío

En `app/_layout.tsx`:
- `loadLocations()` descarga **todas** las filas de `locations` ([Q13](01-queries-y-base-de-datos.md#Q13)).
- `authStore.initialize()` llama `loadUserData()` y el evento `INITIAL_SESSION` vuelve a llamarlo (el flag `_isLoadingData` lo frena a veces, no siempre).
- Hay un timeout de seguridad de 12 s, un hack de `visibilitychange` de 3 s y `resetLoadingFlag`. Son síntomas de un posible bloqueo: [authStore.ts](../../src/store/authStore.ts) hace `await get().loadUserData()` (que llama `supabase.from(...)`) **dentro** del callback de `onAuthStateChange`. La documentación de Supabase advierte que llamar otras funciones de Supabase con `await` dentro de ese callback puede **bloquear** el cliente de auth. Probablemente es la causa de los "cargando infinito" que motivaron esos parches.
- Las fuentes se cargan con `useFonts` en varios componentes, no una sola vez.

**Recomendación:**
- En `onAuthStateChange`, sacar el trabajo del callback: `setTimeout(() => loadUserData(), 0)`. Después, eliminar el timeout de 12 s y el hack de visibilidad.
- `SplashScreen.preventAutoHideAsync()` y ocultar el splash cuando estén listos fuentes, tema y sesión.
- Ubicaciones: datos estáticos en el bundle o caché en AsyncStorage con versión.

---

## E8 🟡 `supabase.auth.getUser()` hace un round-trip de red en cada llamada

Hay 21 usos. `getUser()` **valida contra el servidor de Auth** en cada llamada. `verification.service.ts` lo llama, junto con una consulta a `profiles`, **en cada una de las 4 funciones** de tipo de entidad: son 8 requests extra cada vez que el admin abre la pantalla. El `user.id` y el `role` ya están en `authStore`. Hay que pasarlos como parámetro o leer `useAuthStore.getState()`.

---

## E9 🟡 Dashboards: agregación en el cliente

`premiumDashboard.service.ts`, `reviewStats.service.ts` y `contactClicks.service.ts` descargan **cada fila** (clicks, likes, reseñas) del período y agrupan por día en JS. El volumen crece linealmente con el éxito del negocio. Además, `getVerificationStats` descarga filas para contarlas en vez de usar `count`/`head`.

**Recomendación:** RPCs SQL con `date_trunc('day', created_at)` + `group by` que devuelvan ya agregados (30 filas como máximo). Para los stats de verificación, `{ count: 'exact', head: true }`.

---

## E10 🟡 Trabajo repetido en render

- `useBusinesses`/`useAttractions` pasan `select: (rows) => …` como función inline. React Query **vuelve a ejecutar `select` cuando cambia la referencia**, o sea en cada render del consumidor: se re-mapean y re-filtran todos los ítems. Hay que sacar la función a nivel de módulo o envolverla en `useCallback`.
- `getPublicPromotions` hace `.find()` dentro de `.filter()` dos veces, que es O(n²).
- `getUserLikedReviewIds(...).includes()` dentro de `.map()` es O(n·m). Usar `Set`.
- `Dimensions.get('window')` a nivel de módulo (6 usos): no reacciona a rotación ni a resize en web. Usar `useWindowDimensions`.

---

## E11 🟡 Queries que se ejecutan aunque no se ven

- `AttractionsScreen` siempre ejecuta `useEvents(...)`: `useEvents` no acepta `enabled`, así que los eventos se descargan también en la pestaña Atracciones.
- `useBusinesses` incluye la ubicación en la `queryKey` pero no la usa en la `queryFn`, así que cada cambio de ubicación descarga el mismo dataset completo ([Q2](01-queries-y-base-de-datos.md#Q2)).

---

## E12 🟢 Bundle y dependencias

Sin uso en el código (verificado con grep sobre `src/` y `app/`):

| Paquete | Nota |
|---|---|
| `@expo/vector-icons` | Pesado. El último commit migró a Lucide. |
| `react-datepicker` + `@types/react-datepicker` | Sin imports. |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Sin uso. Recomiendo **usarlos** (ver U9) en lugar de quitarlos. |

Código muerto o duplicado detectado:
- `business.service.ts`: `createBusiness`, `uploadImageToStorage`, `saveBusinessImageReference`, `getAllBusinesses`, `getBusinessesByOwner` sin uso (reemplazados por `createBusiness.service.ts`).
- `features/business/services/categories.ts` está marcado como `@deprecated` y sigue exportado.
- Componentes no alcanzables desde ninguna ruta: `components/ui/ImageSelector`, `components/ui/MapBackground` (duplicado de `components/maps/MapBackground`), `components/events/EventDateSection/DateTimeInput/*`, `components/ui/CalendarPicker/*` (subcomponentes), `components/promotions/WizardStepDiscount/CategorySelection`, `features/auth/hooks/useAuth.ts`, `features/attractions/hooks/useAttractionCategories.ts`, `src/data/costaRica.ts`.
- `hooks/useLocation.ts` tiene funciones con "TODO: Implementar integración con Supabase".
- `updateProductRating` en `productReviews.service.ts` sin uso.
- `lib/supabase/client.ts` tiene lógica de "descompresión `z|`" que nada escribe.
- Hay 4 implementaciones distintas de selector de fecha/hora (`CalendarPicker`, `SimpleDateTimeInput`, `UnifiedDateTimeModal`, `TimePicker`, más `DateTimeInput` sin uso).

---

## E13 🟢 Logs en producción

Hay 205 `console.*` (199 `error`/`warn`). En React Native los logs tienen costo en el bridge y en web dejan ver detalles internos. Se recomienda `babel-plugin-transform-remove-console` en producción (dejando `error`) o un logger con niveles. También: `lib/reanimated` **sobrescribe `console.error`/`console.warn` globalmente en web** para ocultar warnings. Eso puede esconder errores reales que contengan esas subcadenas.
