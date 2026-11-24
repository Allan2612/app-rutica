# Auditoría Rutica — Resumen

> Fecha: 2026-10-15 · Rama: `develop` (`9e9dba7`) · Alcance: todo el repo (`app/`, `src/`, `docs/*.sql`, config)
> Prioridad pedida: **queries → UI/UX → eficiencia**. Seguridad, solo resumida.

## Cómo se hizo

- Revisión estática de servicios, hooks, pantallas, stores y del esquema `docs/base-de-datos/esquema-v3.sql`.
- `tsc --noEmit`: **0 errores**, aunque con 96 `supabase as any` (A2).
- Script propio de alcanzabilidad de imports para encontrar código muerto (knip no corre con TS 5.9).
- Reproduje en Node dos bugs: el filtro de malas palabras (U1) y los getters congelados de Zustand (B2).
- **No** ejecuté la app ni tuve acceso a la BD de producción. Lo que depende de producción está marcado "verificar". El script SQL del repo **no coincide** con producción (faltan RPCs y columnas), así que algunas conclusiones sobre el esquema pueden variar.

## Documentos

| Archivo | Contenido | Hallazgos |
|---|---|---|
| [01-queries-y-base-de-datos.md](01-queries-y-base-de-datos.md) | Queries, PostgREST, esquema, índices, RLS | Q1–Q18, S1–S10 |
| [02-ui-ux.md](02-ui-ux.md) | Flujos, estados vacíos y de error, formularios, accesibilidad, tema | U1–U20 |
| [03-eficiencia-y-rendimiento.md](03-eficiencia-y-rendimiento.md) | React Query, N+1, renders, imágenes, arranque, bundle | E1–E13 |
| [04-bugs-funcionales.md](04-bugs-funcionales.md) | Errores de lógica concretos | B1–B24 |
| [05-seguridad.md](05-seguridad.md) | Auditoría de seguridad completa: RLS, triggers, storage, funciones y código cliente | S-01–S-25 |
| [06-arquitectura-y-calidad.md](06-arquitectura-y-calidad.md) | Duplicación, tipos, errores, tooling | A1–A8 |
| [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md) | Privacidad (Ley 8968), consumidor (Ley 7472), pagos, reseñas, tiendas, licencias | L-01–L-17 |
| [08-calidad-de-codigo.md](08-calidad-de-codigo.md) | Hooks rotos, código muerto, redundancia, funciones perdidas, código fuera de lugar, malas prácticas | C1–C7 |

---

## ⚠️ Seguridad: resolver antes de cualquier release

Lo detallo en [05-seguridad.md](05-seguridad.md):
- **S-01** 🔴 Cualquier usuario puede insertar su suscripción con `status_psub: 'approved'` y tener premium gratis y sin vencimiento. La política RLS no valida el contenido.
- **S-02** 🔴 Las cuotas (`subscription_usage`) las escribe el propio usuario, y ninguna tabla valida límites en el INSERT.
- **S-03 / S-04** 🔴 XSS en los mapas: el nombre de un negocio ejecuta JS. En web roba la sesión, porque el iframe es del mismo origen y la sesión vive en `localStorage`. En el detalle de negocio se dispara con solo abrir la página.
- **S-05** 🔴 (verificar) El rol viaja en `user_metadata` al registrarse. Si `handle_new_user` lo copia, cualquiera se registra como `admin`.
- **S-06 / S-07 / S-08** 🟠 Una vez aprobado, el dueño puede cambiar el contenido sin revisión, reactivar lo que el admin desactivó y extender fechas o descuentos de una promo ya pagada.

## ⚖️ Legal: resolver antes de publicar

Lo detallo en [07-legal-y-cumplimiento.md](07-legal-y-cumplimiento.md). No es asesoría legal.
- **L-01** 🔴 El modal de pago pide transferir a **SINPE `8888-8888`** e IBAN `CR12345678901234567890` (datos de relleno) a nombre de "Rutica S.A".
- **L-02 / L-03** 🔴 No hay Política de Privacidad (el link del registro no abre nada). Los Términos prometen no compartir datos y permitir borrarlos, y el sistema hace lo contrario.
- **L-05 / L-06** 🟠 Los precios que ve el usuario están hardcodeados y no son los que edita el admin. No hay condiciones de compra (IVA, factura, reembolso, renovación).
- **L-07** 🟠 El admin puede reescribir reseñas ajenas sin rastro, y el filtro bloquea quejas legítimas.
- **L-09** 🟠 Falta el borrado de cuenta (obligatorio en las tiendas). Vender funciones digitales por SINPE es un riesgo alto de rechazo en App Store.

## 🧹 Calidad de código

Lo detallo en [08-calidad-de-codigo.md](08-calidad-de-codigo.md).
- **C1** 🔴 Hay hooks después de un `return` temprano en `ReviewsTab` (dashboard premium), lo que provoca un crash al cambiar de período o de negocio.
- **91** funciones o hooks exportados sin uso, **111** imports o variables sin usar, archivos duplicados (`CalendarPicker` ×4, `MapBackground`, `LocationDropdown`/`LocationFilterTab`) y **4** `<Toast>` montados.
- **Funciones perdidas**: hay ~30 helpers en `types/entities/` (`formatLocationLabel`, `getBusinessLogoUrl`, …) sin usar, mientras ese mismo cálculo está copiado hasta 15 veces.
- **611** `any`, 53 `as unknown as`, 35 `as never`.

## Los 10 problemas más importantes (queries / UX / eficiencia)

1. **Listados sin paginación y filtrados en el cliente** (Q1, Q2, U19, E1). Se descarga *toda* la tabla con imágenes y categorías, en cada foco de pantalla, y el filtro de ubicación se hace comparando nombres. En Costa Rica los nombres de distrito se repiten mucho, así que "San Rafael" mezcla todo el país. **Es lo que más va a doler cuando crezca el contenido.**
2. **N+1 en los feeds de atracciones y eventos** (E2): unas 6 requests por post y 180 al abrir un feed de 30, repetidas en cada foco.
3. **El filtro de moderación bloquea reseñas normales** (U1): "espectáculo", "vehículo", "computadora", "reputación", "me robaron"… Probado con el código real.
4. **Los ratings se recalculan desde el cliente y no hay UNIQUE por usuario en reseñas** (Q5, S1). Los promedios pueden desincronizarse y un usuario puede reseñar varias veces.
5. **Errores tragados** (Q17, U4): la app muestra "no hay resultados" cuando en realidad no hay red. El estado de error del Home nunca aparece.
6. **Creación y edición de entidades no transaccional, y find-or-create de ubicación por nombre** (Q14, Q15, B24). Si el geocoder devuelve "Provincia de San José", el vendedor no puede crear su negocio, porque solo los admin pueden insertar provincias.
7. **Re-moderación incoherente:** el código intenta mandar el negocio a `pending` al editar, pero el trigger de la BD lo impide, así que las ediciones se publican sin revisión (U6, S-06). Las ediciones de ubicación de los dueños no se guardan (B25). La galería premium muestra 3 de las 10 fotos vendidas (U7).
8. **Subida de imágenes sin redimensionar y con más de 45 MB de pico de memoria por foto** (E5), y descarga de originales en tarjetas (E6).
9. **Status bar invisible en el tema claro por defecto** (U2), y accesibilidad casi nula: 3 `accessibilityLabel` para 362 botones (U11).
10. **Sin red de seguridad:** no hay tests, ESLint ni CI, y el esquema del repo no es el de producción (A5, S6).

---

## Plan sugerido

### Seguridad urgente (antes que todo lo demás)

- [ ] Trigger que fuerce `pending` en `profile_subscriptions` y auditoría de las aprobadas sin `approved_by` (S-01).
- [ ] Revisar `handle_new_user` y auditar los perfiles `admin` (S-05).
- [ ] Escapar HTML en los mapas y `sandbox="allow-scripts"` en los iframes (S-03, S-04).
- [ ] Revocar INSERT/UPDATE de `subscription_usage` a usuarios (S-02).

### Legal y crashes urgentes

- [ ] Ocultar el pago hasta tener los datos SINPE/IBAN reales y moverlos a la configuración (L-01).
- [ ] Mover los `useMemo` antes del `return` en `ReviewsTab` y `ImageGallery` (C1).
- [ ] Que el modal premium lea los planes y precios de la tabla `subscription` (L-05).
- [ ] Política de Privacidad + Términos revisados por un abogado, con links que funcionen y checkbox de consentimiento (L-02, L-03, L-04).
- [ ] Borrado de cuenta (L-09).

### Quick wins (≤ 1 h cada uno, bajo riesgo)

- [ ] `StatusBar` según el tema (U2).
- [ ] `setMode('auto')` lee `Appearance` (U3).
- [ ] `storage: AsyncStorage` directo en el cliente de Supabase (B1).
- [ ] Quitar los getters de `locationStore` (B2).
- [ ] Agregar `profilePhoto` a las dependencias de `handleRegister` (B3).
- [ ] Agregar `interaction_type_bin` o eliminar el insert de interacción en favoritos (Q8/B4).
- [ ] Quitar `.slice(0, 3)` de la galería, o hacerlo según el plan (U7).
- [ ] Defaults `rating=0`/`reviewCount=0` en `BusinessCard` (U16).
- [ ] Navegar al detalle desde `AttractionsList` (U5).
- [ ] Moderación por palabra completa y sin la lista de "frases de queja" (U1).
- [ ] Escapar el término de búsqueda en `.or()` (Q4).
- [ ] Filtrar `payment_state_prm='paid'` y las fechas en todas las queries públicas de promociones (Q9, Q11).
- [ ] `enabled` en `useEvents` y en las reseñas del feed (`enabled: showReviews`) (E2, E11).
- [ ] Mover el trabajo fuera del callback de `onAuthStateChange` con `setTimeout(…, 0)` (E7).
- [ ] Limpiar `app.json`: permisos duplicados, `RECORD_AUDIO`, `userInterfaceStyle: "automatic"` (B22, U20).
- [ ] Quitar las dependencias sin uso (E12).

### Corto plazo (1–2 semanas)

- [ ] **Paginación** (`useInfiniteQuery` + `.range`) en negocios, atracciones, eventos, promociones y reseñas (Q1).
- [ ] **Filtros por ID en el servidor** (`district_id`, `canton_id`, `province_id`) y formularios que envíen `district_id` (Q2, Q14).
- [ ] Ajustar `staleTime` global y reescribir `useRefreshOnFocus` para que solo refresque queries stale (E1).
- [ ] Servicios que **lanzan** + `ErrorState` común + `ErrorBoundary` en el root (Q17, U4, A3).
- [ ] Triggers de rating en la BD + `UNIQUE(user, entity)` y `CHECK(rating 1..5)` en reseñas (Q5, S1).
- [ ] Likes y conteos con agregado embebido, sin traer todos los likes del usuario (Q6).
- [ ] Redimensionar antes de subir, un helper único de upload y subidas en paralelo (E5).
- [ ] `expo-image` en todas las imágenes y thumbnails (E6).
- [ ] Selectores en `useAuthStore`/`useLocationStore` y un `ThemeProvider` único (E4).
- [ ] Mapa: marcadores por `postMessage`, filtro de bbox en el servidor (Q12, E3).
- [ ] Guards que esperen `isLoading` y un `_layout` de admin con guard (U13, S-22).
- [ ] Política de re-moderación solo para cambios sensibles, avisada en la UI (U6).

### Mediano plazo

- [ ] `supabase/migrations/` como fuente de verdad, tipos regenerados y fuera los `as any` (S6, A2, Q18).
- [ ] RPCs transaccionales `create_business` / `update_business` (y equivalentes) (Q15).
- [ ] Búsqueda con `pg_trgm` o FTS en español (Q4, S7).
- [ ] RLS optimizada: `(select auth.uid())`, vistas públicas sin PII (S4, S-10).
- [ ] Moderación y límites en el servidor (S-06, S-20).
- [ ] Dashboards agregados en SQL (E9).
- [ ] Unificar reseñas y likes en una fábrica genérica (A1).
- [ ] Accesibilidad: `IconButton` con label obligatorio y contraste de `text.tertiary` (U11).
- [ ] ESLint + tests de funciones puras + CI (A5).
