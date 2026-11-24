# 01 · Queries y base de datos

> Auditoría 2026-10-15 · Alcance: `src/**/services`, `src/features/**/services`, `docs/base-de-datos/esquema-v3.sql`
> Severidad: 🔴 crítico · 🟠 alto · 🟡 medio · 🟢 bajo

---

## Q1 🔴 Los listados no tienen paginación ni límite

`getBusinessList` ([business.service.ts:231](../../src/features/business/services/business.service.ts#L231)) trae **todos** los negocios aprobados, cada uno con **todas** sus imágenes, categorías, ubicación anidada (4 niveles) y promociones. Lo mismo pasa con atracciones, eventos, promociones públicas y todas las reseñas (`getBusinessReviews`, `getAttractionReviews`, `getEventReviews`, `getProductReviews`).

- Con 50 negocios funciona. Con 1.000 la respuesta pesa varios MB, y PostgREST corta en `max_rows` (1000 por defecto) **sin avisar**: los negocios que pasen de ahí no aparecen nunca.
- Cada pantalla de listado repite la descarga completa en cada foco (ver [03-eficiencia](03-eficiencia-y-rendimiento.md#E1)).

**Recomendación:** `useInfiniteQuery` + `.range(from, to)` con un orden estable (`created_at desc, id desc`). Páginas de 20.

---

## Q2 🔴 Filtro de ubicación hecho en el cliente comparando nombres

[useBusinesses.ts:100-122](../../src/features/business/hooks/useBusinesses.ts#L100-L122): el filtro de provincia/cantón/distrito se aplica en `select` partiendo `locationLabel` por `", "` y comparando nombres.

En Costa Rica los nombres se repiten mucho:
- "San José" es provincia, cantón y distrito. Si filtras por el **distrito** San José salen todos los negocios de la **provincia** San José.
- "San Rafael", "San Isidro", "San Antonio" y "Carmen" son distritos de decenas de cantones. Filtrar por el distrito "San Rafael" mezcla negocios de todo el país.

Además:
- La `queryKey` incluye `province/canton/district`, pero `queryFn` los ignora. Cada cambio de ubicación crea una entrada nueva de caché y **vuelve a descargar exactamente los mismos datos**.
- El filtro funciona sobre la lista completa, así que depende de Q1.

**Recomendación:** filtrar en el servidor por ID: `locations.district_id_loc = X`, o por cantón/provincia con `!inner` sobre `districts`/`cantons`. Mejor aún, una vista o RPC `search_businesses(p_district_id, p_canton_id, p_province_id, p_category_ids, p_search, p_limit, p_offset)`.

> Revisar el mismo patrón en atracciones, eventos y promociones (ver Q2b más abajo).

---

## Q3 🔴 `business_category_map!inner`: un negocio sin categorías no aparece

[business.service.ts:246](../../src/features/business/services/business.service.ts#L246) usa `business_category_map!inner ( categories!inner (...) )` **siempre**, aunque no haya filtro por categoría.

- En `createBusinessComplete` las categorías se insertan al final y, si falla, el error solo se registra en consola ([createBusiness.service.ts:216-230](../../src/features/business/services/createBusiness.service.ts#L216-L230)). El negocio queda creado, el dueño cree que salió bien, y el negocio nunca aparece en el listado.
- Cuando sí hay filtro, `.in('business_category_map.category_id_bcm', ids)` filtra también las filas embebidas. La tarjeta solo muestra las categorías que coinciden con el filtro, no todas las del negocio.

**Recomendación:** usar `!inner` solo cuando haya filtro de categoría y, para ese caso, un segundo embed sin filtrar (alias), por ejemplo `all_categories:business_category_map(categories(...))`.

---

## Q4 🔴 Búsqueda: texto del usuario interpolado en `.or()` sin escapar

[business.service.ts:286](../../src/features/business/services/business.service.ts#L286):

```ts
query = query.or(`name_bus.ilike.%${term}%,description_bus.ilike.%${term}%`);
```

- Si el usuario escribe `,`, `(`, `)` o `.`, por ejemplo "Café, bar" o "Soda (La Esquina)", PostgREST devuelve error de parseo. La función devuelve `[]` en silencio y la UI muestra "no hay resultados".
- `%` y `_` no se escapan, así que se comportan como comodines.
- `ilike '%x%'` no puede usar ningún índice: es un seq scan sobre `businesses` en cada tecla, si no hay debounce.

**Recomendación:** escapar o citar el término (`"%${term.replace(/[%_\\]/g, '\\$&')}%"` entre comillas dobles en la sintaxis de PostgREST), o mover la búsqueda a una RPC. A mediano plazo, `pg_trgm` con un índice GIN en `name_*` o full-text search en español (`to_tsvector('spanish', ...)`) con `unaccent`.

---

## Q5 🔴 `avg_rating` / `reviews_count` se recalculan desde el cliente

No hay trigger en la BD (`docs/base-de-datos/esquema-v3.sql` no lo tiene; solo los `protect_*_fields` que **impiden** actualizarlos). Cada servicio de reseñas llama `rpc('update_*_rating')` **después** de insertar/editar/borrar:

- [businessReviews.service.ts:316](../../src/services/businessReviews.service.ts#L316)
- `attractionReviews.service.ts:320`, `eventReviews.service.ts:267`, `adminReviews.service.ts:327-460`
- `productReviews.service.ts:93` dice "El trigger se encarga", pero ningún trigger aparece en el script y la función `updateProductRating` queda sin usar.

Problemas:
1. No es atómico. Si la app se cierra o la red falla entre el insert y el RPC, el promedio queda desincronizado para siempre.
2. El "fallback" lee todas las reseñas y hace `update` directo sobre `businesses`. El trigger `protect_business_fields` lo revierte, así que el fallback **nunca funciona** y además cuesta una lectura completa.
3. Hay 3 round-trips secuenciales por reseña (insert → RPC → select profile).
4. Las funciones `update_*_rating` no están en `docs/base-de-datos/esquema-v3.sql`: el script de BD no refleja producción.

**Recomendación:** trigger `AFTER INSERT OR UPDATE OF rating OR DELETE` en cada tabla `*_reviews` que recalcule `avg/count` del padre. Quitar del cliente las llamadas RPC y el fallback.

---

## Q6 🟠 Reseñas: likes contados en el cliente y "mis likes" sin acotar

[businessReviews.service.ts:67-71](../../src/services/businessReviews.service.ts#L67-L71) y [businessReviewLikes.service.ts](../../src/features/business/services/businessReviewLikes.service.ts):

- `getMultipleReviewLikesCount(ids)` descarga **cada fila de like** con `.in('review_id', ids)` y las cuenta en JS. Con 200 reseñas el `.in()` arma una URL de ~7.5 KB (límite práctico de unos 8 KB): falla y devuelve `{}`.
- `getUserLikedReviewIds(userId)` trae **todos** los likes del usuario en **toda la app**, no solo los de este negocio. Después usa `userLikedIds.includes()` dentro de un `map`, que es O(n·m).
- Son 3 queries secuenciales por apertura de detalle.

**Recomendación:** una sola query con agregado embebido:

```ts
.select(`..., likes:business_review_likes(count), my_like:business_review_likes!left(user_id_brl)`)
.eq('my_like.user_id_brl', userId)
```

o una vista `business_reviews_with_stats`. Usar `Set` para `includes`.

> El mismo patrón está copiado en atracciones y eventos (`attractionReviewLikes.service.ts`, `eventReviews...`).

---

## Q7 🟠 Toggle de like/favorito con "leer y luego escribir" (race condition)

`toggleReviewLike` / `toggleBusinessFavorite` ([businessLikes.service.ts](../../src/features/business/services/businessLikes.service.ts)) primero consultan si existe el like y luego insertan o borran. Son 2 round-trips, y un doble tap rápido produce un `23505` o un estado invertido.

**Recomendación:** el cliente ya sabe el estado (`isLikedByUser`). Mandar la acción explícita (`like`/`unlike`) con update optimista, y para el insert usar `upsert(..., { ignoreDuplicates: true })`.

---

## Q8 🟠 Las interacciones de favoritos se insertan sin `interaction_type` (siempre fallan)

[businessLikes.service.ts:136-142](../../src/features/business/services/businessLikes.service.ts#L136-L142) inserta en `business_interactions` sin `interaction_type_bin`, que es `NOT NULL`. Cada like o unlike genera un insert que falla en silencio (`supabase-js` no lanza; el `try/catch` no captura nada). Es una petición desperdiciada y una métrica del dashboard que nunca se llena.

---

## Q9 🟠 `promotions!business_id_prm(id_prm)` trae todas las promociones para saber un booleano

En home ([home.service.ts:295, 340, 511](../../src/features/home/services/home.service.ts#L295)) se embeben **todas** las promociones del negocio (vencidas, rechazadas, etc.) **sin filtro** para calcular `hasActivePromotions`. En home el badge "tiene promociones" sale aunque todas estén vencidas. En el listado sí se filtra (`business.service.ts:273-277`), así que hay inconsistencia entre pantallas.

**Recomendación:** filtrar igual en todos lados o, mejor, una columna calculada o vista `has_active_promotion`. Con `promotions(count)` filtrado alcanza.

---

## Q10 🟠 Imágenes: se descargan todas para elegir una

`business_images ( path_bim, sort_order_bim )` en listados trae toda la galería (hasta 10+) por negocio solo para escoger cover y logo. Lo mismo con `event_images` y `attraction_images` en home.

**Recomendación:** guardar `cover_path` y `logo_path` en la tabla padre (mantenidos por trigger) o filtrar el embed: `.like('business_images.path_bim', '%/cover-%')`. En listados basta 1 imagen.

---

## Q11 🟠 Promociones destacadas no filtran `payment_state_prm = 'paid'`

[home.service.ts:138-141](../../src/features/home/services/home.service.ts#L138-L141) depende de RLS para ocultar las no pagadas. Para el admin y para el dueño, las políticas `promotions_select_admin/own` las dejan pasar, así que **en el home del admin aparecen promos sin pagar o pendientes** como si fueran públicas. Lo mismo en `getHomeStats`. Las queries públicas deben filtrar explícitamente lo mismo que la política pública.

> Aplica igual a negocios, eventos y atracciones: el home de un admin muestra entidades `pending` si alguna query omite el filtro de moderación. Revisar cada query "pública".

---

## Q12 🟠 Mapa: pagina primero y filtra por bounds después

[mapMarkers.service.ts](../../src/features/maps/services/mapMarkers.service.ts): pide `range(0, 499)` **sin `order`** y luego filtra por bounds en JS. `applyBoundsFilter` está definida y no se usa.

- Los marcadores dentro del área visible que no entran en los primeros 500 (en orden no determinista) no se muestran.
- `count: 'exact'` en 3 tablas en cada carga.
- Ver también E3 (el mapa congela los marcadores iniciales).

**Recomendación:** filtrar en el servidor sobre el embed `!inner`: `.gte('locations.latitude_loc', s).lte(...)`. Mejor aún, una RPC `map_markers(bbox)` que devuelva un único JSON con los 3 tipos.

---

## Q13 🟠 `loadLocations()` descarga TODAS las filas de `locations` al iniciar la app

[locationDataService.ts](../../src/features/maps/services/locationDataService.ts): en el arranque (`app/_layout.tsx`) se piden todas las filas de `locations` (una por cada negocio, evento y atracción creados) solo para asignar "coordenadas de distrito". Problemas:

- El costo crece con el contenido y se paga en cada cold start.
- Las coordenadas del distrito quedan como "la última entidad del distrito que llegó", un valor arbitrario.
- Truncado silencioso en 1000 filas.

**Recomendación:** columnas `latitude_dst/longitude_dst` en `districts` (centroides, datos estáticos) o un JSON estático en el bundle. `src/data/costaRica.ts` ya existe. Cachear la jerarquía en AsyncStorage, porque casi nunca cambia.

---

## Q14 🟠 `findOrCreateLocationHierarchy`: hasta 8 round-trips secuenciales y fallos por RLS

[locations.service.ts](../../src/services/locations.service.ts) resuelve país → provincia → cantón → distrito **por nombre** (`ilike` sin escapar comodines). Si el nombre no existe, intenta **crearlo**, pero las políticas `*_insert_admin` solo permiten insertar a los admin. Para un vendedor, cualquier diferencia de texto ("Provincia de San José" frente a "San José", que es típico del reverse geocoding) termina en "No se pudo crear o encontrar la ubicación" y el formulario falla.

- `normalizeString` se define y nunca se usa (la variable `normalized` queda huérfana).
- **Recomendación:** que el formulario envíe `district_id` (los IDs ya están en `locationDataStore`). Eliminar el find-or-create del cliente.

---

## Q15 🟠 Creación de entidades no transaccional

`createBusinessComplete` hace: location → business → N uploads secuenciales → N inserts de `business_images` → categorías. Cada paso puede fallar dejando datos huérfanos (una `locations` sin negocio, un negocio sin categorías, archivos en Storage sin registro). Los errores de imagen o categoría solo se registran en consola; **el usuario no se entera**.

**Recomendación:** RPC `create_business(jsonb)` que inserte location, business y categorías en una transacción y devuelva el `id`. Las imágenes se suben después en paralelo (concurrencia de 3) y se informa al usuario cuáles fallaron.

---

## Q16 🟡 `generateUUID()` con `Math.random()` en el cliente

Copiado en varios servicios. La BD ya tiene `default gen_random_uuid()`. Hay que omitir el `id` en el insert y usar `.select('id_...')`. Si se necesita el id antes (para la ruta de Storage), usar `Crypto.randomUUID()` de `expo-crypto`.

---

## Q17 🟡 Errores tragados: los servicios devuelven `[]`/`null` en vez de lanzar

Patrón general: `if (error) return [];` (home, business list, reviews, markers…). React Query no puede reintentar ni mostrar estado de error, y la UI muestra "No hay resultados" cuando en realidad falló la red. Ver [02-ui-ux](02-ui-ux.md).

**Recomendación:** en `queryFn` siempre `throw error`. Dejar el `[]` solo para "sin datos".

---

## Q18 🟡 `supabase as any` en 96 lugares

`database.types.ts` existe (1111 líneas), pero casi todas las queries lo anulan con `as any`, y hay columnas que el script ni tiene (`whatsapp_phone_bus`, `payment_state_prm`). Los tipos están desactualizados respecto a producción y los errores de nombre de columna solo aparecen en runtime.

**Recomendación:** regenerar con `npx supabase gen types typescript --project-id ... > src/lib/supabase/database.types.ts` (el CLI ya está en `devDependencies`) y eliminar los `as any` progresivamente.

---

## Esquema (`docs/base-de-datos/esquema-v3.sql`)

| # | Sev | Hallazgo |
|---|-----|----------|
| S1 | 🔴 | **No hay UNIQUE (user, entity) en `*_reviews`**: un usuario puede dejar N reseñas al mismo negocio, inflando su rating. Tampoco hay `CHECK (rating between 1 and 5)`. |
| S2 | 🟠 | `subscription_usage_unique` incluye 3 columnas que siempre tienen 2 `NULL`. En Postgres los `NULL` son distintos entre sí, así que **el UNIQUE nunca se dispara** y se pueden duplicar filas de cuota. Usar `UNIQUE NULLS NOT DISTINCT` (PG15+) o índices parciales por tipo. |
| S3 | 🟠 | `get_available_quota`: `photo_event` se mapea a `'gallery_attractions'` en vez de `'gallery_events'`. Además `JOIN subscription s ON s.type_sub = v_subscription_type` no se relaciona con `ps` (no hace nada útil). |
| S4 | 🟠 | Las políticas RLS usan `auth.uid()` directo y `EXISTS (select … from profiles …)` por fila. Supabase recomienda `(select auth.uid())` y `(select public.is_admin())` para que Postgres lo evalúe una vez por query (initPlan) y no una vez por fila. Con listados grandes la diferencia es de órdenes de magnitud. |
| S5 | 🟠 | `products_select_public` y `promotions_select_public` hacen `EXISTS` sobre `businesses` por fila. Los índices existen (`idx_businesses_public_listing`), pero conviene medirlo con `EXPLAIN ANALYZE`. |
| S6 | 🟡 | El script no es reproducible: es un log de migraciones intercalado (políticas sobre `profiles` antes de definir `is_valid_role_update`, `subscription_type` usado antes de crearse, `subscription_type_new` huérfano, políticas `*_admin_update` duplicadas con el mismo nombre en reseñas, `attractions_delete_owner` duplicada, `cron.schedule` sin `create extension pg_cron`). Faltan las RPC `update_*_rating` y las columnas `whatsapp_phone_bus` y `payment_state_prm`. **Recomendación:** adoptar `supabase/migrations/` con el CLI (`supabase db diff`) y dejar que el repo sea la fuente de verdad. |
| S7 | 🟡 | Sin índice para búsqueda de texto (ver Q4). Sin índice compuesto `(moderation_status, is_active, created_at desc)` que coincida con el `order by` de los listados. Con paginación (Q1) conviene crearlo. |
| S8 | 🟡 | Las tablas `*_likes` tienen PK `(entity, user)`: la búsqueda por entidad está cubierta y por usuario hay índice. Bien. Sin embargo `*_review_interactions` e `*_interactions` crecen sin límite (sin retención ni particionado). Planear una agregación diaria. |
| S9 | 🟢 | `locations.latitude/longitude` son `numeric` sin PostGIS. Para "cerca de mí" y bbox se puede vivir con índices B-tree, pero si se agrega "ordenar por distancia" conviene `postgis` + `geography(Point)` + GIST. |
| S10 | 🟢 | `profiles.phone_number_prf unique` permite muchos `NULL` (correcto), pero no normaliza formato: "8888-8888" y "88888888" cuentan como distintos. |
