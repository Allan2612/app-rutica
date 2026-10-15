# 08 · Calidad de código: código muerto, redundancia, malas prácticas y código fuera de lugar

> Auditoría 2026-10-15 · Complementa [06-arquitectura-y-calidad.md](06-arquitectura-y-calidad.md) con un análisis más detallado.
> **Herramientas** (todo fuera del repo, sin modificar el proyecto):
> - Script AST con TypeScript: exports nunca importados, funciones con cuerpo idéntico y llamadas a Supabase fuera de `services/`.
> - ESLint 8 con `react-hooks` + reglas básicas, instalado en una carpeta temporal.
> - `grep` para conteos de patrones.
>
> Los listados de "código muerto" son **candidatos**: un import dinámico o un uso por string podría escaparse. Hay que revisar cada uno antes de borrar.

---

## C1 🔴 Violaciones de las reglas de hooks (posibles crashes)

ESLint `react-hooks/rules-of-hooks`:

| Archivo | Problema | Efecto |
|---|---|---|
| [ReviewsTab.tsx:49-94](../../src/features/manage/screens/PremiumDashboardScreen/tabs/ReviewsTab/ReviewsTab.tsx#L49) | `if (!reviewStats) return null;` **antes** de 3 `useMemo` | Al cambiar de período o de negocio en el dashboard, `reviewStats` pasa a `undefined` mientras carga, la cantidad de hooks cambia y React lanza *"Rendered fewer hooks than expected"*. **La pantalla del dashboard premium (la que se cobra) se cae.** |
| [DetailComponents.tsx:218-224](../../src/components/admin/common/DetailComponents.tsx#L218) (`ImageGallery`) | `if (images.length === 0) return null;` antes de 2 `useCallback` | Mismo crash si las imágenes cambian de 0 a N. Hoy los padres lo evitan con `images.length > 0 &&`, pero es frágil. |

**Fix:** mover el `return` temprano **después** de todos los hooks.

## C2 🟠 Otras advertencias de hooks (20)

| Archivo | Problema |
|---|---|
| `RegisterScreen.tsx:132` | Falta `profilePhoto` en las dependencias: **la foto se pierde** (B3) |
| `MapScreen.tsx:112` | `mapHTML` no depende de `coordinates`, `selectedTypes` ni `showUserLocation`. Es intencional para no recargar, pero esconde E3. |
| `FeaturedAttractions/Businesses/Events/Promotions.tsx`, `AttractionsScreen:74`, `BusinessesScreen:75` | `useMemo` depende de `location?.province…` pero usa `location`. Funciona, aunque es frágil. |
| `useHomeData.ts:146` | Depende de `x.refetch` en lugar de los objetos. Está bien en la práctica, pero conviene `queryClient.refetchQueries({ queryKey: HOME_KEYS.all })`. |
| `EditPromotionWizardScreen.tsx:74` | `useEffect` sin `wizard` en las dependencias: puede inicializar el wizard con datos viejos. |
| `usePremiumDashboardData.ts:63`, `usePremiumModal.ts:289`, `PremiumSection.tsx:49` | Dependencias de más o de menos |
| `useCreate{Business,Attraction,Event}Form`, `useAttractionForm`, `useEventForm` | `validate` no está en las dependencias. Es inofensivo hoy porque `formData` sí está, pero es un patrón propenso a errores. |

---

## C3 🟠 Código muerto

### Archivos completos no alcanzables desde ninguna ruta

`components/ui/ImageSelector/`, `components/ui/MapBackground/` (duplicado de `components/maps/MapBackground/`), `components/events/EventDateSection/DateTimeInput/*` (4 archivos), `components/promotions/WizardStepDiscount/CategorySelection/`, `features/auth/hooks/useAuth.ts`, `features/attractions/hooks/useAttractionCategories.ts`, `src/data/costaRica.ts` (414 líneas de datos estáticos sin usar, que justamente resolverían Q13).

### Funciones y hooks exportados que no se usan en ningún lado (91 candidatos)

| Archivo | Sin uso |
|---|---|
| `features/auth/services/profile.service.ts` | `getMyProfile`, `getMyProfileWithPremium`, `getProfileWithPremiumById`, `checkPremiumStatus`, `updateUserRole`, `updateMyProfile`, `setProfileActiveStatus`, `createPremiumSubscription`, `removePremiumSubscription`. **9 de 11 funciones**; varias apuntan a la tabla legacy `profile_premium`. |
| `features/user/services/subscription.service.ts` | `getSubscriptionPlanById`, `getSubscriptionsByUserId`, `hasAccessToSubscriptionType`, `createSubscription`, `getAllPendingSubscriptions` |
| `features/business/services/business.service.ts` | `createBusiness`, `uploadImageToStorage`, `saveBusinessImageReference`, `getAllBusinesses`, `getBusinessesByOwner` |
| `features/business/services/updateBusiness.service.ts` | `getBusinessForEdit` (~150 líneas) |
| `features/home/services/home.service.ts` | `getTopRatedBusiness` (~95 líneas, con fallback) |
| `features/*/services/*Likes.service.ts` | `get*LikesCount`, `isXLikedByUser` y otros (se usan solo dentro de su `toggle`) |
| Hooks | `useToggleProductStatusAsAdmin`, `useSubscriptionCatalog`, `useVerificationDetail`, `useIsBusinessFavorite`, `useIsReviewLiked`, `useEventReviewLikesCount`, `useMarkersByType`, `useBusinessPromotions`, `useFiltersWithLocation`, `useHasFullPremium` |
| `services/categories.service.ts` | `getCategoryById`, `searchCategories` |
| `features/{business,attractions}/services/categories.ts` | Archivos `@deprecated` completos |
| `types/entities/*.ts` | **~30 helpers** (ver C5) |
| `styles/wizard-shared-styles.ts` | 7 de sus estilos exportados (`sectionHeaderStyles`, `stateStyles`, `productCardStyles`, …) |
| `styles/card-base-styles.ts` | `cardBaseStyles`, `loadingEmptyStyles`, `selectionContainerStyles`, `overlayColors` |
| `utils/promotionHelpers.ts` | `formatDiscountBadge`, `getComboQuantityForProduct`, `calculateComboPrice`, `getActivePromotionForProduct` |
| `utils/formatters.ts` | `formatDaysRemaining`, `formatNumber`, `truncateText` |
| `productReviews.service.ts` | `updateProductRating` (privada, nunca llamada) |

Además hay **68 exports que solo se usan dentro de su propio archivo** (el `export` sobra) y **111 variables o imports sin usar** según ESLint.

### Código inalcanzable o stub

- [useLocation.ts:96](../../src/hooks/useLocation.ts#L96): código inalcanzable. `saveToDatabase()` devuelve `{ success: true }` **sin guardar nada** (la llamada a Supabase está comentada con TODO). Una función que finge éxito es peor que una que no existe.
- `lib/supabase/client.ts`: descompresión `z|…` que nada escribe.
- `@expo/vector-icons`, `react-datepicker` (+ tipos), `react-hook-form`, `@hookform/resolvers` y `zod` están instalados sin uso.

---

## C4 🟠 Redundancia: lo mismo implementado varias veces

### Archivos duplicados (copias casi idénticas)

| Original | Copia | Diferencia |
|---|---|---|
| `components/ui/CalendarPicker/CalendarDaysGrid.tsx` | `…/CalendarDaysGrid/CalendarDaysGrid.tsx` | Solo la ruta del import de `styles` |
| `…/CalendarHeader.tsx` | `…/CalendarHeader/CalendarHeader.tsx` | ídem |
| `…/CalendarWeekDays.tsx` | `…/CalendarWeekDays/CalendarWeekDays.tsx` | ídem |
| `…/PickerModal.tsx` | `…/PickerModal/PickerModal.tsx` | ídem |
| `components/maps/MapBackground/{PulsingNode,TravelingDot}.tsx` | `components/ui/MapBackground/MapBackground.tsx` (todo en un archivo) | Idénticas |
| `components/layout/Header/LocationDropdown/LocationDropdown.tsx` | `components/ui/SearchFilterModal/LocationFilterTab/LocationFilterTab.tsx` | 7 funciones idénticas (`getButtonText`, `getTitle`, `getCurrentData`, `handleItemSelect`, …) |
| `CreatePromotionWizardScreen.tsx:120` | `EditPromotionWizardScreen.tsx:157` | Bloque idéntico de 51 líneas |
| `ModerationConfirmDialog.tsx:57` | `PromotionModerationDialog.tsx:48` | 21 líneas idénticas |

### Helpers reimplementados (aunque ya existe uno central)

| Helper | Implementaciones | Ya existe en |
|---|---|---|
| `getImageUrl` / `getPublicUrl` wrappers | **16** | — |
| `generateUUID` (`Math.random`) | 9 | (la BD genera los ids) |
| `getImageTypeFromPath` | 8 | — |
| Armado de `locationLabel` | 15 | `types/entities/location.ts#formatLocationLabel` (**sin uso**) |
| `getInitials` | 5 | `types/entities/profile.ts#getInitials` |
| `getTimeAgo` / `getTimeAgoForReview` | 5 | — (y `date-fns` está instalado) |
| `formatPrice` / `formatCurrency` | 3 | `utils/formatters.ts#formatPrice` |
| `isUserAdmin` | 3 versiones distintas (`adminProducts`, `adminReviews`, `permissionHelpers`) + `isAdmin(profile)` en types | `authStore.role` y RLS `is_admin()` |
| `getLogoUrl` | 2 idénticas (`contactClicks`, `premiumDashboard`) | — |
| `openMaps` | 2 idénticas | — |
| `hasFullPremium` / `hasActiveSubscription` | 2 servicios distintos (`features/user/services/subscription.service.ts` y `services/userSubscriptions.service.ts`) | — |
| Servicios de perfil | 2 archivos `profile.service.ts` (`features/auth/…` y `features/user/…`) | — |
| Servicios y hooks de categorías | 4 servicios (`services/categories.service.ts`, 2 `categories.ts` deprecados, `features/business/services/categories.service.ts`) + 3 hooks (`useCategories`, `useBusinessCategories`, `useAttractionCategories`) | `services/categories.service.ts` |
| Selector de fecha/hora | 5 (`CalendarPicker`, `SimpleDateTimeInput`, `UnifiedDateTimeModal`, `TimePicker`, `DateTimeInput`) | — |
| Configuración de `Toast` | 4 `<Toast>` montados (root, `AdminSubscriptionsScreen`, `PremiumModal/ToastConfig`, `ProfileScreen/ProfileToastConfig`) | root |

> ⚠️ Montar varios `<Toast>` de `react-native-toast-message` hace que **el último montado capture todos los toasts**. Mientras estás en esas pantallas, los toasts globales salen con otro estilo o detrás de un modal, y al desmontar pueden perderse. Debe haber **uno solo** en el root.

Además están los servicios casi copiados por entidad (reseñas ×4, likes ×3, update ×4, create ×4); ver [A1](06-arquitectura-y-calidad.md).

### Funciones "perdidas": existen, pero el código las ignora

Hay utilidades bien hechas que nadie usa mientras el mismo cálculo está copiado en otros lados:
- `types/entities/location.ts#formatLocationLabel`, frente a 15 copias manuales.
- `types/entities/business.ts#getBusinessLogoUrl/getBusinessCoverUrl/getBusinessGalleryUrls`, frente a 8 `getImageTypeFromPath` y lógica de logo/cover en cada servicio.
- `types/entities/event.ts#isEventPast/isEventOngoing`, frente a comparaciones de fechas sueltas.
- `types/entities/review.ts#calculateAverageRating/formatRating`, frente a los fallbacks de rating de cada servicio.
- `utils/formatters.ts#formatDate/formatDateRange/formatPrice`, frente a los formateadores locales.
- `src/data/costaRica.ts` (provincias, cantones y distritos), frente a la descarga de `locations` en el arranque (Q13).
- `styles/wizard-shared-styles.ts` y `styles/card-base-styles.ts`, frente a los estilos repetidos en cada `styles.ts`.

**Recomendación:** decidir el módulo canónico de cada helper, cambiar las copias por él y borrar el resto. Así un bug se corrige una vez.

### Referencias a objetos que no existen en el esquema del repo

| El código usa | En `docs/base-de-datos/esquema-v3.sql` |
|---|---|
| RPC `update_business_rating`, `update_event_rating`, `update_attraction_rating`, `update_product_rating` | ❌ No están |
| Tabla `profile_premium` (`features/auth/services/profile.service.ts`, `database.types.ts`) | ❌ No está (legacy) |
| Columnas `subscription_id_psub`, `whatsapp_phone_bus` (solo en código muerto), `payment_state_prm`, `payment_note_admin_prm` | ❌ No están en ningún `CREATE`/`ALTER TABLE`, aunque índices, políticas y triggers las usan |
| Trigger `handle_new_user`, función `is_valid_role_update` | ❌ No están |
| `useLocation.saveToDatabase` → tabla `user_locations` | ❌ No existe (código comentado) |

---

## C5 🟠 Código fuera de lugar

| Qué | Dónde está | Dónde debería estar |
|---|---|---|
| **Catálogo de planes y precios** (`SUBSCRIPTION_PLANS`, 8 planes con precio) | `types/entities/profile.ts:202` | En la tabla `subscription`, que ya existe y que el admin edita. Ver [L-05](07-legal-y-cumplimiento.md#l-05). |
| **Datos de pago** (SINPE, IBAN, titular) | Constantes en `PremiumModal.tsx` | Configuración en la BD o en el entorno ([L-01](07-legal-y-cumplimiento.md#l-01)) |
| **Términos y Condiciones** (409 líneas de JSX) | `features/user/TermsScreen/TermsScreen.tsx` | Documento versionado en una URL o en Markdown cargado por la app |
| ~30 funciones de lógica (URLs, fechas, permisos) | `types/entities/*.ts` | `utils/` o `lib/` (los archivos de tipos no deberían tener runtime) |
| Tipos de dominio (`BusinessListItem`, `EventListItem`, `AttractionListItem`) | Dentro de hooks (`useBusinesses.ts`, …) e importados por servicios | `types/entities/` (hoy los servicios dependen de hooks: dependencia invertida) |
| Llamadas directas a Supabase | `store/authStore.ts`, `ProfileEditModal.tsx`, `ManageAttractionsScreen.tsx`, `RecoverScreen.tsx`, `ResetPasswordScreen.tsx`, `useDeepLinkHandler.ts`, `useProfilePhoto.ts`, `useAttractions.ts`, `useEvents.ts`, `useAuth.ts` | `services/` |
| Servicios "globales" frente a los de feature | `src/services/*Reviews.service.ts` frente a `src/features/*/services/` | Elegir un criterio: por feature o compartidos en `services/` |
| Lista de palabras prohibidas (moderación) | Cliente (`contentModeration.service.ts`) | Servidor (trigger o Edge Function) |
| URLs de Edge Functions con el project-ref hardcodeado | `emailNotification.service.ts:19-21` | `supabase.functions.invoke('email-paid')` (usa la URL del cliente) |
| `WEB_APP_URL` hardcodeada | `utils/authRedirect.ts` | Variable de entorno `EXPO_PUBLIC_WEB_URL` |
| Lógica de cuotas (incremento y verificación) | Cliente (`subscriptionQuota.service.ts`) | Triggers en la BD ([S-02](05-seguridad.md#s-02)) |
| Recálculo de ratings | Cliente | Trigger en la BD (Q5) |
| Configuración del `Toast` | Inline en `app/_layout.tsx` y 3 copias más | Un componente `ToastConfig` único en `components/ui` |
| Supresión de warnings (`console.error` override) | `lib/reanimated/index.ts` | No suprimir globalmente; arreglar la causa o filtrar solo en `__DEV__` |
| Fuente de verdad del esquema | `docs/base-de-datos/esquema-v3.sql` (documentación) | `supabase/migrations/` |
| `HomeScreen` importa `'../../../../components/home'` | `features/home/screens/HomeScreen` | `@/components/home` (el propio estándar del proyecto lo pide) |

---

## C6 🟡 Malas prácticas (conteos)

| Patrón | Cantidad | Comentario |
|---|---|---|
| `any` (`: any` / `as any`) | **611** | Incluye 96 `supabase as any`. El tipado estricto queda anulado. |
| `as unknown as` | 53 | Casts forzados para silenciar al compilador |
| `as never` | 35 | Truco para meter payloads en `insert`/`update` sin tipos |
| `@ts-ignore` | 4 | Por ejemplo, `PromotionModerationDialog.tsx:15` *"Styles file exists"*: se ignora un error de import en vez de arreglarlo |
| `eslint-disable` sin ESLint configurado | 5 | Hay comentarios de lint, pero no lint |
| `catch {}` vacío | 7 | `createEvent.service.ts:215,235` traga los fallos de **subida de imágenes del evento** |
| `catch` con solo un comentario | 21 | Mismo efecto |
| `key={index}` en listas | 25 (8 archivos, entre ellos `ReviewCard`, `ProductImageCarousel`, `StarRatingInput`) | Estado mezclado al reordenar o borrar ítems |
| Archivos de más de 300 líneas | 49 | Los mayores: `home.service.ts` (902), `verification.service.ts` (850), `subscription.service.ts` (825) |
| `setTimeout` para navegar o sincronizar | 30 | Ver A6 |
| `console.*` | 205 | Ver E13 / S-23 |
| `style={{…}}` inline | 213 | Un objeto nuevo por render y el tema sin centralizar |
| Colores hex sueltos en `.tsx` | 278 | No respetan el tema (oscuro/claro) |
| Variables o imports sin usar (ESLint) | 111 | |
| Precio como string reparseado | `PlansSummary.tsx:61`: `parseInt(plan.price.replace(/[^\d]/g, ''))` | Formatear un número para luego volver a parsearlo, cuando el número (`priceValue`) ya existe |
| Detección de "imagen existente" por subcadena | `uri.includes('supabase.co')` en 5 servicios | Usar el `path` guardado, no heurísticas sobre la URL |
| Funciones que devuelven éxito falso | `useLocation.saveToDatabase` | Ver C3 |
| Errores de dominio en inglés mezclados con español | `'No authenticated user'`, `'Some subscription plans were not found'` (subscription.service) frente a mensajes en español | Llegan al usuario por Toast |

---

## C7 🟢 Convenciones inconsistentes

- **Nombres de archivo**: `use-color-scheme.ts` (kebab-case) frente a `useThemedColors.ts` (camelCase); `promotions.helpers.ts` frente a `helpers.ts` frente a `userBusinesses.helpers.ts`; `TermsScreen/` directo en `features/user/` frente a `screens/X/` en el resto.
- **Firmas de servicio**: algunas reciben `userId` como parámetro y otras llaman a `supabase.auth.getUser()` por dentro (21 veces).
- **Contrato de error**: `throw`, `return []`, `return null` y `return false` conviven (A3).
- **Query keys**: string literal (`'business-favorites'`), constante (`ATTRACTION_REVIEWS_KEY`) o fábrica (`HOME_KEYS`, `verificationKeys`, sin usar). Conviene un único `queryKeys.ts`.
- **Barrels `index.ts`**: casi todos los componentes tienen uno. Ocultan el código muerto (mi primer análisis de alcanzabilidad no lo detectaba por eso) y crean ciclos de imports con facilidad.

---

## Plan de limpieza sugerido (orden de menor a mayor riesgo)

1. **Arreglar C1** (2 archivos, 10 minutos): son crashes reales.
2. **Agregar ESLint** (`eslint-config-expo` + `react-hooks` + `@typescript-eslint/no-unused-vars` + `no-empty`) y quitar los 111 imports y variables sin uso con `--fix`.
3. **Borrar duplicados físicos**: `CalendarPicker/*.tsx` sueltos (dejar las versiones en carpeta), `components/ui/MapBackground`, `components/ui/ImageSelector`, `DateTimeInput/*`, `CategorySelection`, `useAuth.ts`, `useAttractionCategories.ts`, los dos `categories.ts` deprecados y las funciones muertas de `business.service.ts` y de `features/auth/services/profile.service.ts`.
4. **Un solo `<Toast>`** en el root.
5. **Centralizar helpers** (`getImageUrl`, `formatLocationLabel`, `getInitials`, `getTimeAgo` con `date-fns`, `formatPrice`, `isAdmin` desde el store) y reemplazar las copias.
6. **Mover el catálogo de planes y los datos de pago a la BD** (L-01, L-05).
7. **Fusionar los servicios duplicados** (perfil ×2, suscripciones ×2, categorías ×4, `LocationDropdown`/`LocationFilterTab` en un hook `useLocationPickerState`, Create/Edit Promotion Wizard en un hook común).
8. **Fábrica genérica de reseñas y likes** (A1). Es el cambio más grande; conviene hacerlo con tests.
9. **Regenerar los tipos de Supabase** y eliminar `as any`/`as never`/`as unknown as` de forma progresiva, archivo por archivo.
