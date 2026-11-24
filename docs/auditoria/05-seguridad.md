# 05 · Auditoría de seguridad

> Fecha: 2026-10-15 · Alcance: `docs/base-de-datos/esquema-v3.sql` completo (RLS, funciones, triggers, storage) y todo el código cliente (`app/`, `src/`).
> Método: revisión estática. No se probó contra el proyecto de Supabase en vivo.
> Severidad: 🔴 crítico · 🟠 alto · 🟡 medio · 🟢 bajo · **(verificar)** depende de objetos que no están en el script.

## Contexto importante

Supabase expone **toda la BD por API REST** con la `anon key`, que viaja dentro de la app y cualquiera puede extraer. Por eso **la única barrera real es RLS más los triggers**. Todo lo que la app valida en el cliente (rol, cuotas, moderación, límites, pagos) un atacante lo puede saltar con `curl` o con la consola del navegador:

```js
await supabase.from('profile_subscriptions').insert({ ..., status_psub: 'approved' })
```

Varios de los hallazgos siguientes son exactamente eso.

**Objetos que el script no contiene y que hay que revisar en producción:** `handle_new_user()` (trigger de registro), `is_valid_role_update()` (usada en `profiles_update_own`), las RPC `update_{business,event,attraction,product}_rating`, la tabla legacy `profile_premium`, la columna `subscription_id_psub`, y las Edge Functions `email-paid` y `email-subscription-status`.

---

## Resumen

| # | Sev | Hallazgo |
|---|-----|----------|
| [S-01](#s-01) | 🔴 | Cualquier usuario puede **auto-aprobarse suscripciones premium** sin pagar |
| [S-02](#s-02) | 🔴 | Cuotas manipulables: el usuario escribe su propio `subscription_usage` |
| [S-03](#s-03) | 🔴 | XSS en el mapa de detalle de negocio: se ejecuta **solo con visitar** la página |
| [S-04](#s-04) | 🔴 | XSS en el mapa de exploración (popups de marcadores) |
| [S-05](#s-05) | 🔴 (verificar) | Escalada a `admin` en el registro si `handle_new_user` confía en `user_metadata.role` |
| [S-06](#s-06) | 🟠 | Bypass de moderación: después de aprobado, el dueño cambia el contenido sin revisión |
| [S-07](#s-07) | 🟠 | El dueño puede **reactivar** lo que el admin desactivó (`is_active` sin proteger) |
| [S-08](#s-08) | 🟠 | Bypass de pago en promociones: extender fechas o cambiar el descuento después de pagar |
| [S-09](#s-09) | 🟠 | Manipulación de ratings: reseñas ilimitadas por usuario y auto-reseñas en eventos y atracciones |
| [S-10](#s-10) | 🟠 | Exposición de datos personales: teléfono y datos de **todos** los perfiles legibles por `anon` |
| [S-11](#s-11) | 🟠 | URLs de redes sociales abiertas sin validar (`javascript:`, `intent:`, phishing) |
| [S-12](#s-12) | 🟠 (verificar) | Edge Function `email-paid` recibe el destinatario `to` desde el cliente: posible relay de correo y phishing con la marca |
| [S-13](#s-13) | 🟠 (verificar) | `is_valid_role_update()`: la transición de roles queda definida por una función que no está en el repo |
| [S-14](#s-14) | 🟡 | Deep link de recovery acepta tokens arbitrarios (login CSRF / fijación de sesión) |
| [S-15](#s-15) | 🟡 | Cambio de contraseña sin reautenticación |
| [S-16](#s-16) | 🟡 | Analítica falsificable: inserts anónimos sin límite y con `user_id` arbitrario |
| [S-17](#s-17) | 🟡 | Storage sin límite de tamaño ni de tipo MIME, y listado público de buckets |
| [S-18](#s-18) | 🟡 | Privacidad: los likes y favoritos de cada usuario son públicos |
| [S-19](#s-19) | 🟡 | `postMessage('*')` y listener sin validar origen (mapa en web) |
| [S-20](#s-20) | 🟡 | Moderación de contenido y límites solo en el cliente |
| [S-21](#s-21) | 🟡 | Funciones `SECURITY DEFINER` ejecutables por `anon` / con parámetro de perfil arbitrario |
| [S-22](#s-22) | 🟢 | Guard de UI faltante en `admin/reviews`; guards solo cosméticos |
| [S-23](#s-23) | 🟢 | Logs con datos personales, mensajes de error crudos y supresión global de `console.error` |
| [S-24](#s-24) | 🟢 | Política de contraseñas débil (6 caracteres) y sin borrado de cuenta |
| [S-25](#s-25) | 🟢 | Reseñas y likes sobre entidades no aprobadas u ocultas |

---

<a id="s-01"></a>
## S-01 🔴 Auto-aprobación de suscripciones premium

**Dónde:** `esquema-v3.sql:180-183`

```sql
create policy "Users can create own subscriptions"
  on public.profile_subscriptions for insert
  with check (auth.uid() = profile_id_psub);
```

La política solo comprueba **de quién** es la fila, no **qué contiene**. No hay trigger que fuerce `status_psub = 'pending'`. El cliente ([subscription.service.ts:315-327](../../src/features/user/services/subscription.service.ts#L315-L327)) no lo envía porque confía en el default, pero un atacante sí puede mandarlo:

```js
supabase.from('profile_subscriptions').insert({
  profile_id_psub: myId, subscription_type_psub: 'full_premium',
  payment_reference_psub: 'x', status_psub: 'approved',
  approved_at_psub: new Date().toISOString(), expires_at_psub: null  // nunca expira
})
```

**Impacto:** premium completo gratis y para siempre. Toda la app (`hasFullPremium`, `getMyApprovedSubscriptions`, dashboard, cuotas) lee `status_psub = 'approved'`.

**Fix:**
```sql
create or replace function public.protect_profile_subscription_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    new.status_psub := 'pending';
    new.approved_at_psub := null; new.approved_by_psub := null;
    new.rejected_at_psub := null; new.rejected_by_psub := null;
    new.rejection_reason_psub := null; new.expires_at_psub := null;
    new.cancelled_at_psub := null;
  end if;
  return new;
end $$;
create trigger trg_protect_psub_insert before insert on public.profile_subscriptions
  for each row execute function public.protect_profile_subscription_insert();
```
Agregar también un trigger `BEFORE UPDATE` equivalente. La política de cancelación ya restringe el estado, pero no el resto de columnas: un usuario puede cambiar `subscription_type_psub` o `expires_at_psub` en una suscripción `pending` antes de cancelarla.

---

<a id="s-02"></a>
## S-02 🔴 Cuotas controladas por el usuario

**Dónde:** `esquema-v3.sql:861-877`, [subscriptionQuota.service.ts](../../src/services/subscriptionQuota.service.ts), `subscription.service.ts:426+`

- `"Users can insert own usage"` y `"Users can update own usage"` solo validan `profile_id_sus = auth.uid()`. El usuario puede:
  - `update subscription_usage set used_count_sus = 0` → cuota infinita.
  - `insert` con `max_quota_sus = 99999` contra **cualquier** `profile_subscription_id_sus`, incluso una suya `pending` o `rejected`, porque no se valida que la suscripción esté aprobada ni que el tipo coincida.
- El conteo (`incrementUsage`/`decrementUsage`/`syncResourceUsage`) es del cliente: es un read-modify-write con race condition.
- **Ninguna tabla** (`products`, `business_images`, `promotions`, …) valida la cuota en el `INSERT`. Aunque `subscription_usage` estuviera bien protegida, un vendedor puede insertar 500 productos o 100 fotos directo por API.

**Fix:** quitar INSERT/UPDATE de `subscription_usage` para usuarios. Agregar triggers `BEFORE INSERT` en `products`, `*_images` y `promotions` que llamen a una función `SECURITY DEFINER` que cuente los recursos existentes frente al límite (gratis + cuotas aprobadas y vigentes) y haga `raise exception` si se excede. Dejar `subscription_usage` como tabla derivada mantenida por esos triggers, o eliminarla y calcular al vuelo.

---

<a id="s-03"></a>
## S-03 🔴 XSS en el mapa del detalle de negocio

**Dónde:** [BusinessMap.tsx:27](../../src/components/business/BusinessMap/BusinessMap.tsx#L27) + [markerScripts.ts:83](../../src/components/maps/LeafletMap/markerScripts.ts#L83)

```ts
const popupContent = `<b>${businessName}</b>${phone ? `<br>${phoneSvg}${phone}` : ''}`;
...
marker.bindPopup(${JSON.stringify(popup)}).openPopup();
```

- `bindPopup` interpreta HTML. Un negocio con nombre `<img src=x onerror="…">` ejecuta JS, y como el popup se abre con `.openPopup()`, **basta con abrir el detalle**.
- `JSON.stringify` dentro de `<script>` no escapa `</script>`, así que también se puede romper el bloque de script.
- El teléfono también se inyecta.
- **Web:** el mapa es `<iframe srcDoc>` **sin `sandbox`**. Un `srcdoc` hereda el origen del padre, así que el script puede leer `parent.localStorage`, donde `supabase-js` guarda el `access_token` y el `refresh_token`. Eso permite **robar la sesión** de cualquier visitante, incluidos los admins que revisan negocios pendientes.
- **Nativo:** corre dentro de la WebView (`originWhitelist={['*']}`) y puede mandar `postMessage` a la app (ver S-04).

El nombre lo controla el dueño, y gracias a S-06 lo puede cambiar **después** de que el negocio fue aprobado.

**Fix:**
```ts
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');
```
Escapar `businessName` y `phone`, serializar con `safeJson`, y en web usar `<iframe sandbox="allow-scripts">` **sin** `allow-same-origin`.

---

<a id="s-04"></a>
## S-04 🔴 XSS en el mapa de exploración

**Dónde:** [ExploreMap/mapStyles.ts:240, 377](../../src/components/maps/ExploreMap/mapStyles.ts#L240)

```js
var markers = ${markersJSON};                 // JSON.stringify sin escapar </script>
'<h3>' + m.name + '</h3>'                      // nombre sin escapar
```

Afecta los nombres de negocios, atracciones y eventos. Las **atracciones las puede crear cualquier usuario registrado** (`attractions_insert_user`), aunque deben pasar moderación (ver S-06). El impacto es el mismo que en S-03: robo de sesión en web, ejecución dentro de la WebView en nativo. Además, el handler `onMessage` de la app hace `router.push(data.route)` con cualquier ruta que le mande la página.

**Fix:** igual que en S-03, más validar `route` contra una lista blanca (`/^\/(businesses|attractions|events)\/[0-9a-f-]{36}(\?from=maps)?$/`).

---

<a id="s-05"></a>
## S-05 🔴 (verificar) Escalada de rol en el registro

**Dónde:** [auth.service.ts:68-80](../../src/features/auth/services/auth.service.ts#L68-L80)

```ts
supabase.auth.signUp({ email, password, options: { data: { ..., role: role } } })
```

`user_metadata` lo controla **100 % el cliente**. El comentario dice que `handle_new_user()` crea el perfil, pero esa función no está en el repo. La política `profiles_insert_own` (que exige `role_prf = 'user'`) **no aplica** a un trigger `SECURITY DEFINER`. Como la UI permite elegir "vendedor", es muy probable que el trigger copie `raw_user_meta_data->>'role'`. Si es así:

```js
supabase.auth.signUp({ email, password, options: { data: { role: 'admin' } } })
```

crea un **administrador**, con acceso total vía `is_admin()` a moderación, aprobación de suscripciones, borrado y edición de todo.

**Fix:** en `handle_new_user()`:
```sql
v_role := case when new.raw_user_meta_data->>'role' = 'seller' then 'seller' else 'user' end;
```
Nunca castear el metadata directo a `user_role`. Revisar también si hay admins creados por esta vía: `select id_prf, created_at_prf from profiles where role_prf='admin'`.

---

<a id="s-06"></a>
## S-06 🟠 Bypass de moderación por edición posterior

**Dónde:** `businesses_update_own`, `events_update_own`, `attractions_update_own`, `promotions_update_own`, triggers `protect_*_fields`; tablas `*_images`, `*_category_map`, `promotion_products`, `promotion_combo_items`.

Los triggers impiden que el dueño toque `moderation_status_*`, y lo **revierten** al valor anterior. Por eso:

- El cliente manda `moderation_status_bus: 'pending'` al editar ([updateBusiness.service.ts:459](../../src/features/business/services/updateBusiness.service.ts#L459)), pero el trigger lo revierte a `approved`. **Los cambios se publican al instante, sin revisión.**
- El flujo de ataque: publicar un negocio inocente, esperar la aprobación y luego cambiar nombre, descripción, imágenes (en `business_images`/Storage, que no tienen moderación), enlaces y teléfono por contenido ofensivo, fraude o phishing.
- Los productos no tienen moderación en absoluto.

> ⚠️ Esto **corrige** lo que dije en [02-ui-ux.md U6](02-ui-ux.md): la intención del código es volver a `pending`, pero la BD lo impide. El problema real es el opuesto.

**Fix:** en el trigger `BEFORE UPDATE`, si un no-admin cambia campos de contenido (`name`, `description`, `social_links`, `website`, `contact_*`), **forzar** `moderation_status := 'pending'` (en lugar de copiar el `old`). Para imágenes y categorías, un trigger en esas tablas que marque al padre como `pending`. Si se quiere evitar que el negocio desaparezca mientras tanto, guardar la edición en una tabla de "cambios propuestos".

---

<a id="s-07"></a>
## S-07 🟠 Reactivación de contenido desactivado por el admin

`is_active_bus/_evt/_atr/_prd/_prm` **no** está en los triggers `protect_*_fields`. Si el admin desactiva algo como sanción (`toggleEntityActive` en [verification.service.ts](../../src/features/admin/services/verification.service.ts#L808)), el dueño lo vuelve a activar con un `update`.

**Fix:** separar "pausado por el dueño" (`is_active`) de "bloqueado por admin" (columna nueva `is_blocked_*` protegida en el trigger e incluida en las políticas `*_select_public`).

---

<a id="s-08"></a>
## S-08 🟠 Bypass de pago en promociones

`protect_promotion_fields` protege `payment_state_prm` y `moderation_status_prm`, pero **no** `start_at_prm`, `end_at_prm`, `discount_value_prm`, `discount_type_prm`, `scope_prm` ni las tablas hijas (`promotion_products`, `promotion_combo_items`, `promotion_scope_categories`).

Un vendedor paga y obtiene la aprobación de una promo de 1 mes, después cambia `end_at_prm` a 2030 y el descuento a lo que quiera, y sigue `approved + paid`.

**Fix:** en el trigger, si un no-admin cambia fechas, descuento o alcance de una promo `approved`, volverla a `pending`. O bloquear esas columnas una vez pagada. Aplicar lo mismo con triggers en las tablas hijas.

---

<a id="s-09"></a>
## S-09 🟠 Manipulación de ratings

- **No hay `UNIQUE (user_id, entity_id)`** en ninguna tabla `*_reviews`. Un usuario puede insertar 500 reseñas de 1★ al competidor o 500 de 5★ a su amigo. La UI lo esconde (`hasUserReview`), pero la API no.
- **No hay `CHECK (rating between 1 and 5)`**: `rating = 1000` o `-50` deforma el promedio.
- `event_reviews_insert_auth` y `attraction_reviews_insert_auth` **no impiden** que el creador reseñe lo suyo (negocios y productos sí lo impiden).
- Los promedios los recalcula el **cliente** con RPC ([01 Q5](01-queries-y-base-de-datos.md)). Hay que revisar que `update_*_rating` (que no está en el repo) sea `SECURITY DEFINER` y **no** acepte el valor como parámetro.

**Fix:**
```sql
alter table business_reviews add constraint uq_brv unique (business_id_brv, user_id_brv),
                             add constraint ck_brv check (rating_brv between 1 and 5);
-- idem event/attraction/product
```
Agregar `not exists (… created_by_evt = auth.uid())` en eventos y atracciones, y un trigger de recálculo en la BD.

---

<a id="s-10"></a>
## S-10 🟠 Datos personales expuestos

```sql
create policy "profiles_select_public" on public.profiles for select using (is_active_prf = true);
```

Cualquiera (incluido `anon`, sin cuenta) puede hacer `select * from profiles` y obtener **nombre completo, segundo apellido, teléfono personal, rol y foto de todos los usuarios**. Esto choca con la Ley 8968 de Protección de Datos de Costa Rica y con las políticas de las tiendas de apps.

Además:
- `*_likes` y `*_review_likes` con `select using (true)` permiten armar el perfil de gustos de cualquier usuario (ver S-18).
- `business_reviews_select_all` incluye `user_id`, que se puede cruzar con `profiles`.

**Fix:**
```sql
drop policy "profiles_select_public" on profiles;
create view public.public_profiles with (security_invoker = false) as
  select id_prf, first_name_prf, last_name1_prf, profile_photo_path_prf from profiles where is_active_prf;
grant select on public.public_profiles to anon, authenticated;
```
Cambiar los embeds `profiles!…(first_name_prf, …)` por la vista, o usar una RPC. El admin sigue leyendo la tabla con una política `is_admin()`.

---

<a id="s-11"></a>
## S-11 🟠 URLs de usuario abiertas sin validar

**Dónde:** `BusinessDetailScreen.tsx:30-34` → `ContactSection` → `Linking.openURL(url)` con `social_links_bus.facebook/instagram/tiktok` **tal cual vienen de la BD**. También en `EventDetailScreen.tsx:37`.

- `javascript:…` en web.
- `intent://…#Intent;…` en Android (lanza actividades de otras apps).
- `sms:`, `tel:` a números premium, `file:`.
- Phishing ("Instagram" que lleva a un sitio falso de login).

`EventContactSection` sí antepone `https://instagram.com/` si el valor no empieza con `http`, pero `http://evil.com` pasa igual. `website` se "repara" con `https://`, pero tampoco se valida el dominio.

**Fix:** validar en el formulario **y** en la BD (`CHECK` o trigger) con allowlists por red: `^https://(www\.)?(facebook|instagram|tiktok)\.com/[A-Za-z0-9._-]+/?$`, o guardar solo el username y construir la URL en la app. Para `website`, aceptar solo `https?://` y mostrar el dominio antes de abrirlo.

---

<a id="s-12"></a>
## S-12 🟠 (verificar) Edge Functions de email

**Dónde:** [emailNotification.service.ts](../../src/services/emailNotification.service.ts)

- `email-paid` recibe `{ to, userName, packageName, amount, paymentReference }` **desde el cliente**. Si la función no comprueba que `to` sea el email del usuario autenticado, cualquiera puede mandar correos con la plantilla de Rutica (desde el Gmail SMTP del proyecto) a cualquier dirección, con texto controlado. Si las plantillas (`emails.html`) interpolan `{{userName}}` sin escapar, eso es **phishing con la marca** e inyección de HTML en el correo.
- `email-subscription-status` (aprobado/rechazado) debe verificar que quien llama es **admin**. Si no, cualquiera puede mandar "Tu suscripción fue aprobada" a cualquier `profileId`.
- Riesgo secundario: si se abusa, Gmail bloquea la cuenta SMTP y dejan de llegar los correos legítimos.

**Fix:** dentro de cada función, `supabase.auth.getUser(jwt)`. Que `email-paid` ignore `to` y lo busque en la BD a partir del `user.id`. Que `email-subscription-status` exija `is_admin`. Escapar las variables HTML. Agregar rate limiting.

---

<a id="s-13"></a>
## S-13 🟠 (verificar) Cambios de rol del propio usuario

El script tiene **dos** políticas `profiles_update_own` (líneas 250 y 1897): una usa `is_valid_role_update(old_role, new_role)` y la otra prohíbe cambiar el rol. Como `upgradeToSeller()` ([features/user/services/profile.service.ts](../../src/features/user/services/profile.service.ts)) funciona desde el cliente, en producción debe estar la primera. **Toda la seguridad de roles depende de `is_valid_role_update`, que no está en el repo.** Debe permitir **solo** `user|buyer → seller` y nada hacia `admin` o `premium`.

Además existe `updateUserRole(userId, role)` en `features/auth/services/profile.service.ts`. Hay que verificar que RLS lo limite a admin, porque el código no lo hace.

---

<a id="s-14"></a>
## S-14 🟡 Deep link de recovery con tokens arbitrarios

[useDeepLinkHandler.ts](../../src/hooks/useDeepLinkHandler.ts) toma `access_token`/`refresh_token` de **cualquier** URL `rutica://…#…type=recovery` y hace `setSession`. Un atacante envía un link con **sus propios** tokens, la víctima queda logueada en la cuenta del atacante y lo que cargue (fotos, datos de negocio, pagos) termina en esa cuenta.

**Fix:** flujo PKCE (`flowType: 'pkce'` en `createClient`) y `exchangeCodeForSession(code)` / `verifyOtp({ token_hash, type: 'recovery' })` en lugar de aceptar tokens del fragmento.

---

<a id="s-15"></a>
## S-15 🟡 Cambio de contraseña sin reautenticación

`ResetPasswordScreen` llama `updateUser({ password })` con solo tener sesión, y la pantalla es accesible navegando directo a `/reset-password`. Con una sesión robada (S-03/S-04), el atacante cambia la contraseña y se queda con la cuenta.

**Fix:** activar en Supabase *Auth → Secure password change* (exige reautenticación reciente) y que la pantalla solo funcione con `_isRecoveryMode === true`.

---

<a id="s-16"></a>
## S-16 🟡 Analítica falsificable

`business_contact_clicks_insert_all` y `*_interactions_insert_all` tienen `with check (true)` para `anon`:
- Un bucle de inserts infla o hunde las métricas del **dashboard premium, que se cobra**.
- Se puede poner `user_id_bin` de **otro usuario** y `ip_address`/`user_agent` arbitrarios.
- Sin límite de volumen, es un vector de DoS de almacenamiento.

**Fix:** RPC `track_contact_click(business_id, type)` que tome `auth.uid()` en el servidor, ignore al dueño y deduplique por (usuario o IP, negocio, tipo, hora). Revocar el INSERT directo. Agregar rate limiting en una Edge Function si se acepta `anon`.

---

<a id="s-17"></a>
## S-17 🟡 Storage

- Los 6 buckets se crean con `file_size_limit = null` y `allowed_mime_types = null`. Un usuario puede subir archivos de **cualquier tamaño y tipo** (`.html`, `.svg` con JS, ejecutables) en su carpeta. Como los buckets son **públicos**, quedan servidos desde `*.supabase.co`: alojamiento gratis de malware o phishing con el dominio del proyecto, y costos de almacenamiento y egress.
- Las políticas `*_select_all` sobre `storage.objects` permiten **listar** el contenido completo de cada bucket (`storage.from('business-images').list()`), incluidas imágenes de entidades pendientes o rechazadas. Para servir archivos públicos no hace falta una política SELECT.
- El código decide si una imagen "ya existe" con `uri.includes('supabase.co')` (varios `update*.service.ts`), que es fácil de engañar con una URL que contenga ese texto.

**Fix:**
```sql
update storage.buckets set file_size_limit = 5242880,
  allowed_mime_types = '{image/jpeg,image/png,image/webp}' where id in (...);
```
Eliminar las políticas SELECT de listado si no se usa `.list()`.

---

<a id="s-18"></a>
## S-18 🟡 Likes y favoritos públicos

`*_likes_select_all` y `*_review_likes_select_all` usan `using (true)`, así que cualquiera puede ver qué negocios marcó como favoritos cada usuario. Junto con S-10 permite perfilar personas.

**Fix:** `using (user_id = auth.uid())` para las filas, y exponer los **conteos** con una vista agregada o con columnas `likes_count`.

---

<a id="s-19"></a>
## S-19 🟡 Mensajería del iframe del mapa sin validar

[MapScreen.tsx:56-64, 121-126](../../src/features/maps/screens/MapScreen/MapScreen.tsx#L56): `postMessage(message, '*')` y `window.addEventListener('message', …)` **sin revisar `event.source`/`origin`**. Cualquier ventana (un iframe de terceros, un `window.opener`) puede hacer `router.push(cualquierRuta)`.

**Fix:** `if (event.source !== iframeRef.current?.contentWindow) return;` más la lista blanca de rutas de S-04.

---

<a id="s-20"></a>
## S-20 🟡 Validaciones solo en el cliente

| Regla | Dónde se valida hoy | En la BD |
|---|---|---|
| Malas palabras en reseñas | `contentModeration.service.ts` (solo en negocio, evento y atracción; productos no) | ❌ |
| Longitud de textos (nombre, descripción, comentario) | No se valida | ❌ (columnas `varchar`/`text` sin límite) |
| Máximo de fotos y productos | Pickers, UI | ❌ (ver S-02) |
| Máximo de promociones gratis | `ManagePromotionsScreen` | ❌ |
| Formato de email, URL y teléfono | No se valida | ❌ |

Con textos sin límite, alguien puede guardar una descripción de 10 MB que luego descarga cada visitante del listado (DoS de ancho de banda).

**Fix:** `CHECK (char_length(name_bus) between 2 and 120)`, `CHECK (char_length(description_bus) <= 2000)`, `CHECK (char_length(comment_brv) <= 1000)`, etc., más triggers para las reglas de negocio.

---

<a id="s-21"></a>
## S-21 🟡 Funciones `SECURITY DEFINER`

En Postgres, `EXECUTE` se concede a `PUBLIC` por defecto, y Supabase además lo concede a `anon`/`authenticated`.
- `get_available_quota(p_profile_id, …)` acepta **cualquier** `profile_id`, así que se puede consultar la cuota y el uso de otro usuario (fuga de información comercial). Debe usar `auth.uid()` internamente o comprobar `p_profile_id = auth.uid() or is_admin()`.
- `expire_monthly_subscriptions()` tiene un `GRANT … TO service_role`, pero **no** un `REVOKE … FROM public`. Cualquiera puede llamarla. Hoy es inofensivo (hace lo mismo que el cron), pero es mala práctica.
- `get_available_quota` y `calculate_subscription_expiry` no fijan `set search_path`. Las `SECURITY DEFINER` deben llevar `set search_path = public, pg_temp`.
- Revisar en producción que `update_*_rating` y `handle_new_user` cumplan lo mismo.

**Fix:** `revoke execute on function … from public, anon, authenticated;` y luego conceder solo a quien corresponda.

---

<a id="s-22"></a>
## S-22 🟢 Guards de UI

- `app/(app)/(tabs)/manage/admin/reviews.tsx` no tiene `RequireRole`.
- `RequireRole` es solo cosmético: la protección real es RLS. Está bien así, pero conviene un `_layout.tsx` en `manage/admin/` con el guard para no depender de envolver cada pantalla.

---

<a id="s-23"></a>
## S-23 🟢 Logs y mensajes de error

- `console.log('[emailNotification] Sending email to:', data.userEmail)` y otros 205 `console.*` registran emails, ids y errores completos. En web los ve cualquiera en DevTools y en dispositivos quedan en logcat.
- Los Toast muestran `error.message` crudo de Supabase/PostgREST (nombres de tablas, políticas, constraints), lo que da información útil para un atacante.
- `lib/reanimated` reemplaza `console.error`/`console.warn` globales en web, lo que puede ocultar errores reales.

---

<a id="s-24"></a>
## S-24 🟢 Política de cuentas

- La contraseña mínima es de 6 caracteres, sin más reglas. Se recomienda subirla a 8 o más en *Auth → Password requirements* y activar la protección contra contraseñas filtradas (HaveIBeenPwned) de Supabase.
- **No hay opción de eliminar la cuenta.** Google Play y App Store la exigen para apps con registro, y la Ley 8968 lo contempla como derecho de supresión. Hay que implementar una RPC o Edge Function `delete_account` que borre `auth.users` (en cascada) y los archivos de Storage.
- No hay CAPTCHA en registro y recuperación. Supabase trae hCaptcha/Turnstile integrado y lo recomiendo, sobre todo por S-16 y por el envío de emails.

---

<a id="s-25"></a>
## S-25 🟢 Interacción con entidades no públicas

`*_reviews_insert_auth` solo exige `is_active`, no `moderation_status = 'approved'`. Lo mismo pasa con los likes. Se puede reseñar o dar like a entidades pendientes o rechazadas que el usuario no debería ver (conociendo el UUID).

---

## Hallazgos colaterales (no de seguridad, descubiertos al leer RLS)

- **Las ediciones de ubicación de los dueños no se guardan.** `locations_update_admin` solo permite UPDATE al admin. `updateBusiness.service.ts:322` y `updateEvent.service.ts:281` hacen `update` sobre `locations` **sin revisar el error**. RLS deja 0 filas afectadas sin error y el dueño cree que movió su negocio. En `updateAttraction.service.ts:260` el error tampoco salta, porque 0 filas no es error. Si en producción se "arregló" abriendo el UPDATE de `locations` a todos los autenticados, entonces **cualquiera puede mover cualquier negocio**. Hay que verificarlo.
- `businesses_insert_seller` exige `moderation_status_bus = 'pending'`, pero `createBusinessComplete` no lo envía y la columna no tiene `default`. Si producción coincide con el script, crear negocios fallaría. Probablemente producción tiene un `default 'pending'` que el script no refleja (un ejemplo más de S6 en [01](01-queries-y-base-de-datos.md)).
- En el script hay políticas duplicadas con el mismo nombre (`*_admin_update` en las 4 tablas de reseñas, `attractions_delete_owner`, `profiles_update_own`), así que **el script no corre de punta a punta**. Hay que pasarlo a migraciones (ver A2).

---

## Plan de remediación sugerido

**Hoy (antes de cualquier release):**
1. S-01: trigger que fuerce `pending` en `profile_subscriptions`. Auditar las filas `approved` sin `approved_by_psub`.
2. S-05: revisar `handle_new_user` y auditar los perfiles `admin`.
3. S-03/S-04: escapar HTML en los mapas y poner `sandbox` en los iframes.
4. S-02: revocar INSERT/UPDATE de `subscription_usage` a usuarios.

**Esta semana:**
5. S-06/S-07/S-08: triggers que vuelvan a `pending` cuando cambia el contenido y bloqueo por admin separado de `is_active`.
6. S-09: `UNIQUE` + `CHECK` en reseñas y auto-reseñas bloqueadas (limpiar los duplicados antes de crear el índice).
7. S-10/S-18: vista `public_profiles` y likes privados.
8. S-11: validar URLs sociales en formulario y BD.
9. S-12/S-13: revisar las Edge Functions de email y `is_valid_role_update`.

**Después:**
10. S-14 a S-25, y pasar el esquema a `supabase/migrations/` para que lo que se audita sea lo mismo que corre en producción.
