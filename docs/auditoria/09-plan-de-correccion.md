# 09 · Plan de corrección

> Rama: `fix/auditoria-2026-10` (sale de `develop`) · Commits: Conventional Commits en inglés (`type(scope): description`), como los últimos del repo.
> **Todos los cambios de modelo** van en **un solo script**: [`docs/base-de-datos/migraciones/2026-10-15_auditoria.sql`](../base-de-datos/migraciones/2026-10-15_auditoria.sql). Es idempotente (se puede correr más de una vez) y va dentro de una transacción.
> Lo que aparezca mientras se corrige se anota en [10-hallazgos-durante-correccion.md](10-hallazgos-durante-correccion.md).
>
> Leyenda: ✅ hecho · 🟡 parcial (ver nota) · ⏳ pendiente (requiere decisión, entorno o es un refactor grande) · 🧑‍⚖️ requiere abogado/contador

## Orden de despliegue

1. Revisar y **correr el script SQL** en Supabase (SQL Editor), primero en un proyecto de staging si existe.
2. Mergear la rama y publicar web (Vercel).
3. **Generar un APK/AAB nuevo** con EAS. Hace falta un build nativo, no alcanza con OTA: cambia `app.json` (fuente embebida, permisos) y se agrega una dependencia nativa (`expo-image-manipulator`).

El código de la rama está pensado para funcionar **antes y después** del script SQL, salvo donde se indique.

---

## Fase 0 · Preparación

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 0.1 | Ordenar `docs/` (`auditoria/`, `base-de-datos/`, `guias/`, `email-templates/`) + `docs/README.md` | — | ✅ |
| 0.2 | Crear la rama `fix/auditoria-2026-10` | — | ✅ |
| 0.3 | Agregar ESLint al repo (`npm run lint`) para detectar regresiones mientras se corrige | A5, C2 | ✅ |

## Fase 1 · Script SQL único (modelo, seguridad, rendimiento)

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 1.1 | Trigger que protege `profile_subscriptions` (sin auto-aprobación ni cambios de campos sensibles) | S-01 | ✅ |
| 1.2 | `subscription_usage`: cuota forzada según el plan + suscripción propia + `UNIQUE NULLS NOT DISTINCT` | S-02, S2 | ✅ |
| 1.3 | Límites de recursos validados en la BD (productos, fotos, promociones) | S-02, X5 | ✅ |
| 1.4 | Rol seguro en el registro (sin `admin`/`premium` desde el metadata) | S-05 | ✅ |
| 1.5 | Cambios de rol y de `is_active` del propio perfil solo `user/buyer → seller` | S-13 | ✅ |
| 1.6 | Re-moderación al editar contenido aprobado (negocio, evento, atracción, promoción, imágenes) | S-06, U6 | ✅ |
| 1.7 | Bloqueo por admin que el dueño no puede revertir (`is_blocked_*`) | S-07 | ✅ |
| 1.8 | Promos: cambiar fechas, descuento o alcance de una promo aprobada la vuelve a `pending` | S-08 | ✅ |
| 1.9 | Reseñas: `UNIQUE (user, entity)`, `CHECK` 1..5, sin auto-reseña, solo sobre entidades aprobadas | S-09, S1, S-25 | ✅ |
| 1.10 | Triggers de recálculo de `avg_rating`/`reviews_count` | Q5 | ✅ |
| 1.11 | Teléfono de los perfiles no legible públicamente + RPC `get_my_profile` | S-10, L-08 | ✅ |
| 1.12 | Likes privados + RPC de conteos agregados | S-18, Q6 | ✅ |
| 1.13 | Analítica: `user_id` no falsificable; los clicks del dueño no cuentan | S-16 | ✅ trigger de límite: 10 clicks por usuario y comercio cada 10 min, 60 anónimos por minuto |
| 1.14 | Buckets: límite de 5 MB y solo imágenes | S-17 | ✅ |
| 1.15 | `SECURITY DEFINER`: `search_path`, `REVOKE`, `get_available_quota` con control de dueño, mapeo de `photo_event` | S-21, S3 | ✅ |
| 1.16 | Dueños pueden actualizar la `location` de lo suyo | B25 | ✅ |
| 1.17 | `default 'pending'` en `moderation_status_*` | 05 colaterales | ✅ |
| 1.18 | Límites de longitud de textos (`NOT VALID` para no romper datos existentes) | S-20 | ✅ |
| 1.19 | Índices de trigramas para búsqueda + índices de listado | Q4, S7 | ✅ |
| 1.20 | RPC `delete_my_account` | L-09 | ✅ |
| 1.21 | Consentimiento: `terms_version_prf`, `terms_accepted_at_prf` | L-04 | ✅ |
| 1.22 | Trazabilidad de edición de reseñas por admin (`moderated_at_*` + log) | L-07 | ✅ |
| 1.23 | Configuración de pago en la BD (`app_settings`) | L-01 | ✅ |
| 1.24 | RLS con `(select auth.uid())` en las políticas calientes | S4 | ✅ 152 políticas reescritas con `(select …)` (menos las que se consultan a sí mismas, por recursión); migración 2026-11-24 |

## Fase 2 · Crashes y bugs críticos (cliente)

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 2.1 | Fuente Caveat en el APK: embebida + sin `fontWeight` en nativo + carga única con splash | U21, U14 | ✅ |
| 2.2 | Hooks después de `return` (`ReviewsTab`, `ImageGallery`) | C1 | ✅ |
| 2.3 | Storage de sesión: `AsyncStorage` directo | B1 | ✅ |
| 2.4 | Getters congelados en `locationStore` | B2 | ✅ |
| 2.5 | Foto de perfil perdida en el registro | B3 | ✅ |
| 2.6 | Posible bloqueo en `onAuthStateChange` + quitar los parches de timeout | E7 | ✅ |
| 2.7 | Errores ignorados al actualizar la ubicación | B25 | ✅ |
| 2.8 | Insert de interacción inválido en favoritos | Q8, B4 | ✅ |

## Fase 3 · Seguridad (cliente)

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 3.1 | Escapar HTML/JSON en los mapas + `sandbox` en los iframes | S-03, S-04 | ✅ |
| 3.2 | `postMessage`: validar origen y lista blanca de rutas | S-19 | ✅ |
| 3.3 | URLs de redes y web: validar al abrir y al guardar | S-11 | ✅ |
| 3.4 | Escapar el término de búsqueda en `.or()` | Q4 | ✅ |
| 3.5 | Guard en `admin/reviews` + guards que esperan la carga del rol | S-22, U13 | ✅ |
| 3.6 | `updateUser` de contraseña solo en modo recovery | S-15 | ✅ |
| 3.7 | Deep link de recovery con PKCE / `verifyOtp` | S-14 | ✅ `token_hash` + `verifyOtp`; plantilla de correo nueva (se aplica al publicar) |
| 3.8 | Edge Functions de email (validar destinatario y rol) | S-12 | ✅ funciones en el repo, JWT obligatorio, destinatario validado (H-04) |

## Fase 4 · Legal (cliente)

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 4.1 | Datos de pago leídos de `app_settings`; si no hay, el pago se oculta | L-01 | ✅ |
| 4.2 | Planes y precios leídos de la tabla `subscription` | L-05 | ✅ |
| 4.3 | Links de Términos/Privacidad que funcionan + checkbox de consentimiento | L-02, L-04 | ✅ |
| 4.4 | Borrador de Política de Privacidad (pantalla + documento) | L-02 | ✅ borrador completo con terceros actuales y reportes; falta responsable y edad mínima 🧑‍⚖️ |
| 4.5 | Borrar cuenta desde Configuración | L-09 | ✅ |
| 4.6 | "Editada por moderación" visible en reseñas editadas por admin | L-07 | ✅ |
| 4.7 | Permisos de `app.json` mínimos, sin ubicación "Always" | L-09, B22 | ✅ |
| 4.8 | Términos con condiciones de compra, IVA, factura y reembolso | L-03, L-06 | ✅ borrador con condiciones de compra; IVA, factura, retracto y plazo de devolución marcados 🧑‍⚖️ |
| 4.9 | Botón "Reportar" contenido | L-12 | ✅ "Reportar" en comercios, eventos, atracciones y reseñas + pantalla de admin |
| 4.10 | Pagos dentro de la tienda (Apple/Google) | L-09 | ✅ decisión registrada: solo web/APK mientras se cobre fuera de las tiendas (`docs/legal/decision-distribucion-y-pagos.md`) |

## Fase 5 · Queries y rendimiento

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 5.1 | React Query: `staleTime` global + `useRefreshOnFocus` respeta stale | E1 | ✅ |
| 5.2 | Los servicios de listado lanzan el error (en vez de devolver `[]`) + `ErrorState` | Q17, U4 | ✅ |
| 5.3 | N+1 del feed: reseñas solo al expandir; modales sin montar | E2 | ✅ |
| 5.4 | Likes de reseñas: conteo agregado y solo los del usuario visibles | Q6 | ✅ |
| 5.5 | Ratings: quitar el recálculo del cliente (lo hace el trigger) | Q5 | ✅ |
| 5.6 | Promos públicas: filtrar `paid`/fechas; `hasActivePromotions` correcto en home | Q9, Q11 | ✅ |
| 5.7 | `!inner` de categorías solo cuando se filtra | Q3 | ✅ |
| 5.8 | Mapa: marcadores actualizables, bbox y orden estable | E3, Q12 | ✅ |
| 5.9 | Stores con selectores en componentes de lista + `ThemeProvider` | E4 | ✅ una paleta por tema compartida; tema sincronizado una vez en el root; selectores en todos los stores |
| 5.10 | `useEvents` con `enabled`; `select` estable | E10, E11 | ✅ |
| 5.11 | Subida de imágenes: helper único, redimensionado y paralelo | E5 | ✅ |
| 5.12 | `expo-image` en las tarjetas de lista | E6 | ✅ `expo-image` en las tarjetas de lista |
| 5.13 | `getUser()` → id del store | E8 | ✅ `getSessionUser()` (sesión local) en los servicios |
| 5.14 | **Paginación** (`useInfiniteQuery`) en listados y reseñas | Q1, U19 | ✅ listados y reseñas de a 20 con `useInfiniteQuery` y "Ver más" |
| 5.15 | **Filtro de ubicación por ID en el servidor** | Q2 | ✅ zona → IDs de `locations` (con caché) y filtro en SQL; secciones "en tu zona"/"otros lugares" paginadas |
| 5.16 | `loadLocations` sin descargar `locations` | Q13 | ✅ |
| 5.17 | Dashboards agregados en SQL | E9 | ✅ RPC agregadas por hora y totales |

## Fase 6 · UI/UX

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 6.1 | `StatusBar` según el tema | U2 | ✅ |
| 6.2 | Tema "Automático" aplica al instante | U3 | ✅ |
| 6.3 | Moderación de reseñas por palabra completa y sin censurar quejas | U1 | ✅ |
| 6.4 | Feed de atracciones navega al detalle | U5 | ✅ |
| 6.5 | Galería según el plan (no `slice(0,3)`) | U7 | ✅ |
| 6.6 | `BusinessCard` sin rating falso; nombres sin "null" | U16, U17 | ✅ |
| 6.7 | `Alert.alert` → Toast/diálogo (funciona en web) | U12 | ✅ |
| 6.8 | Pull-to-refresh fantasma en Home | U15 | ✅ |
| 6.9 | Errores de auth traducidos; "revisa tu correo" | U9 | ✅ |
| 6.10 | Accesibilidad: `accessibilityLabel` en botones de ícono | U11 | ✅ todos los botones de solo ícono con rol y etiqueta |
| 6.11 | Validación de formularios con zod | U9, U10 | ✅ esquemas zod compartidos (registro, contraseña, contacto) |

## Fase 7 · Calidad de código

| # | Tarea | Ref | Estado |
|---|-------|-----|--------|
| 7.1 | Borrar código muerto y archivos duplicados | C3, C4 | ✅ |
| 7.2 | Un solo `<Toast>` | C4 | ✅ |
| 7.3 | Quitar dependencias sin uso | E12 | ✅ |
| 7.4 | Helpers centralizados (`formatPersonName`, `getImageUrl`, etc.) | C4 | ✅ `publicStorageUrl`, `getImageTypeFromPath`, iniciales y fechas relativas compartidas |
| 7.5 | No sobrescribir `console.error` global en web | E13 | ✅ |
| 7.6 | Fábrica genérica de reseñas/likes, tipos regenerados, quitar `any` | A1, A2 | 🟡 tipos regenerados, fábricas de reseñas y likes; `any` de 617 a 455 con tope en CI (resto en servicios de escritura) |
| 7.7 | Tests + CI | A5 | ✅ vitest (25 pruebas) + PGlite (34 chequeos) en CI |
