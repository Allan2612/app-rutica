# 07 · Legal y cumplimiento

> Auditoría 2026-10-15 · Alcance: textos legales en la app, flujos de datos personales, pagos, contenido de usuarios, licencias, requisitos de tiendas.
> ⚖️ **Esto no es asesoría legal.** Es una revisión técnica de riesgos para llevarle a un abogado. Las leyes citadas son de Costa Rica: **Ley 8968** (Protección de la Persona frente al Tratamiento de sus Datos Personales) y su Reglamento, y **Ley 7472** (Promoción de la Competencia y Defensa Efectiva del Consumidor) y su Reglamento, incluido el capítulo de comercio electrónico.
> Severidad: 🔴 crítico · 🟠 alto · 🟡 medio · 🟢 bajo

## Resumen

| # | Sev | Tema |
|---|-----|------|
| [L-01](#l-01) | 🔴 | Datos de pago **de relleno** en producción (SINPE `8888-8888`, IBAN ficticio, "Rutica S.A") |
| [L-02](#l-02) | 🔴 | No existe una **Política de Privacidad**; el link del registro no hace nada |
| [L-03](#l-03) | 🔴 | Los Términos prometen cosas que el sistema no cumple (privacidad, terceros, eliminación de datos) |
| [L-04](#l-04) | 🟠 | Consentimiento no válido: aceptación implícita ("al registrarte aceptas"), sin checkbox ni registro |
| [L-05](#l-05) | 🟠 | Precios mostrados distintos de los configurados por el admin (catálogo hardcodeado) |
| [L-06](#l-06) | 🟠 | Venta de planes sin condiciones de compra: sin IVA, reembolsos, renovación ni identificación del proveedor |
| [L-07](#l-07) | 🟠 | Reseñas: el filtro bloquea quejas legítimas y el admin puede **reescribir** reseñas ajenas sin rastro |
| [L-08](#l-08) | 🟠 | Datos personales públicos (teléfonos y nombres de todos los usuarios) |
| [L-09](#l-09) | 🟠 | Requisitos de Google Play / App Store: borrado de cuenta, URL de privacidad, permisos innecesarios |
| [L-10](#l-10) | 🟡 | Transferencia internacional de datos sin informar (Supabase, Nominatim/OSM, CARTO, Vercel, Gmail) |
| [L-11](#l-11) | 🟡 | Precios con descuentos acumulados que pueden no coincidir con lo que cobra el comercio |
| [L-12](#l-12) | 🟡 | Contenido de terceros: sin procedimiento de denuncia o retiro por derechos de autor ni de reporte de contenido |
| [L-13](#l-13) | 🟡 | Atribución de mapas: se elimina la de CARTO al cambiar al proveedor de respaldo; uso de tiles y Nominatim fuera de su política |
| [L-14](#l-14) | 🟡 | Sin cláusula de edad mínima ni tratamiento de menores |
| [L-15](#l-15) | 🟢 | Teléfonos personales de los desarrolladores en los Términos y Soporte |
| [L-16](#l-16) | 🟢 | Registro de base de datos ante la PRODHAB (verificar si aplica) |
| [L-17](#l-17) | 🟢 | Licencias de software: OK. Uso de marcas de redes sociales |

---

<a id="l-01"></a>
## L-01 🔴 Datos de pago de relleno

[PremiumModal.tsx:34-37](../../src/components/user/PremiumModal/PremiumModal.tsx#L34-L37):

```ts
const SINPE_NUMBER = '8888-8888';
const SINPE_NAME = 'Rutica CR';
const IBAN_ACCOUNT = 'CR12345678901234567890';
const TRANSFER_NAME = 'Rutica S.A';
```

- Un vendedor que compra un plan **transfiere dinero a `8888-8888`**. Ese número puede pertenecer a una persona real ajena al proyecto. El dinero se pierde, Rutica queda como responsable frente al consumidor y el admin "aprueba" pagos que nunca recibió.
- "Rutica S.A" presenta una sociedad anónima. Si no está constituida, es información falsa sobre la identidad del proveedor (Ley 7472).
- Los datos de pago están **en el bundle**: cambiarlos exige un nuevo build y pasar de nuevo por la revisión de las tiendas.

**Acción inmediata:** ocultar el flujo de pago hasta tener los datos reales. Moverlos a la BD (tabla de configuración que solo el admin edita) o a variables de entorno, y mostrar el nombre legal real del titular de la cuenta.

---

<a id="l-02"></a>
## L-02 🔴 No hay Política de Privacidad

- En el registro ([RegisterScreen.tsx:151-158](../../src/features/auth/screens/RegisterScreen/RegisterScreen.tsx#L151-L158)), los textos "Términos y Condiciones" y "**Política de Privacidad**" tienen estilo de link pero **no tienen `onPress`**: no abren nada.
- No existe ninguna pantalla, ruta ni URL de política de privacidad en el repo. Solo hay una sección 6 de 5 líneas dentro de los Términos.
- La Ley 8968 (art. 5) exige informar **de forma expresa, precisa e inequívoca**, antes de recolectar: qué datos se recogen, para qué, quién es el responsable y su domicilio, los destinatarios, si es obligatorio darlos, las consecuencias de negarse, y cómo ejercer los derechos de acceso, rectificación y supresión.
- Google Play y App Store **exigen** una URL pública de política de privacidad para publicar, y más aún si se piden ubicación, cámara y fotos.

**Contenido mínimo que debería tener**, según lo que la app hace hoy:

| Dato | Uso real en el código |
|---|---|
| Nombre, apellidos, email, teléfono, foto | Perfil, se muestra públicamente (ver L-08) |
| Ubicación GPS precisa | Header, mapa, formularios. Se envía a Nominatim (OSM) para el reverse geocoding |
| Fotos de la galería y la cámara | Imágenes de negocios, productos y perfil (buckets públicos) |
| Favoritos, likes y reseñas | Públicos y visibles para cualquiera (ver S-18) |
| Clicks de contacto | Analítica para el dueño del negocio |
| Referencia de pago SINPE / transferencia | Verificación manual de pagos |
| Email | Envío de notificaciones por Gmail SMTP (Edge Functions) |

---

<a id="l-03"></a>
## L-03 🔴 Los Términos prometen cosas que el sistema no cumple

[TermsScreen.tsx](../../src/features/user/TermsScreen/TermsScreen.tsx), sección 6, frente a la realidad:

| Promesa en los Términos | Realidad en el código |
|---|---|
| "No vender ni **compartir** sus datos personales con terceros" | Coordenadas a Nominatim (OSM Foundation, Reino Unido), IP y ubicación a CARTO (tiles), datos a Supabase (EE. UU.), Vercel y Gmail. Además, **cualquier persona** puede leer teléfono y nombre de todos los usuarios ([S-10](05-seguridad.md#s-10)) |
| "Utilizar la información de ubicación únicamente para mejorar su experiencia" | Se envía a un servicio externo en cada detección |
| "Almacenar sus datos de forma segura" | Teléfonos públicos, XSS que permite robar sesiones ([S-03](05-seguridad.md#s-03)), premium auto-aprobable |
| "Permitirle solicitar la eliminación de su cuenta y datos asociados en cualquier momento" | No hay ningún mecanismo. Solo un email de Gmail |
| "El contenido puede ser revisado y moderado" | Después de aprobado, el dueño cambia todo sin revisión ([S-06](05-seguridad.md#s-06)) |
| "Se notificará a los usuarios sobre cambios significativos" | No existe un sistema de versiones de términos ni de notificación |

Además faltan elementos básicos: **quién es "Rutica"** (persona física o jurídica, cédula, domicilio), el responsable del tratamiento de datos, las condiciones de los servicios pagos (L-06), la edad mínima (L-14) y el procedimiento de reclamos.

Prometer garantías que no se cumplen es peor que no prometerlas: puede configurar publicidad engañosa y agrava la responsabilidad ante un incidente.

**Recomendación:** que un abogado redacte Términos y Política de Privacidad acordes a lo que el sistema **realmente** hace (o arreglar el sistema primero). Publicarlos en una URL web versionada, por ejemplo `rutica-orpin.vercel.app/legal/privacidad`, y que la app los cargue de ahí en lugar de tenerlos hardcodeados en un componente.

---

<a id="l-04"></a>
## L-04 🟠 Consentimiento no válido

- Registro: "Al registrarte, aceptas nuestros Términos…". Es un *browsewrap* sin acción afirmativa y con links que no abren (L-02).
- Login: "Al iniciar sesión, aceptas…".
- "Explorar sin cuenta" no muestra ningún aviso, aunque igual se pide ubicación y se envía a terceros.
- No se guarda **qué versión** de los términos aceptó cada usuario ni **cuándo**. Si hay un conflicto, no hay prueba de consentimiento.
- La Ley 8968 exige un consentimiento **expreso**, y para la ubicación es recomendable pedirlo de forma separada y explicar para qué se usa.

**Recomendación:** un checkbox obligatorio "Acepto los Términos y la Política de Privacidad" (con links que funcionen), las columnas `terms_version_prf` y `terms_accepted_at_prf` en `profiles`, y volver a pedir la aceptación cuando cambie la versión.

---

<a id="l-05"></a>
## L-05 🟠 El precio que ve el cliente no es el precio configurado

- El catálogo que **ve el usuario** está hardcodeado en `SUBSCRIPTION_PLANS` ([types/entities/profile.ts:202](../../src/types/entities/profile.ts#L202)): 8 planes con `price: '₡2,500'` y `priceValue: 2500`.
- El catálogo que **edita el admin** está en la tabla `subscription` (pantalla `AdminSubscriptionsScreen` → `SubscriptionPlanModal`): 7 planes en el seed.
- Si el admin sube o baja un precio, o desactiva un plan, **la app sigue mostrando el valor hardcodeado** y el usuario paga ese monto. Según la Ley 7472, el precio anunciado obliga al proveedor, así que el admin no puede rechazar el pago "porque el precio cambió".

**Recomendación:** que el modal premium lea `getAllSubscriptionPlans()` (ya existe) y borrar `SUBSCRIPTION_PLANS`.

---

<a id="l-06"></a>
## L-06 🟠 Venta de planes sin condiciones de compra

Hoy se venden 7 u 8 planes de ₡1.500 a ₡10.000, dos de ellos "Pago mensual recurrente". Faltan:

- **Identificación del proveedor**: nombre o razón social, cédula, domicilio y medio de contacto (requisito del Reglamento de la Ley 7472 para comercio electrónico).
- Si el precio **incluye IVA (13 %)** y si se emite **factura electrónica**. Hacienda exige comprobante electrónico por cada venta. Esto debe consultarse con un contador.
- Qué significa "recurrente": no hay cobro automático; la suscripción vence a 1 mes (`expire_monthly_subscriptions`) y el usuario debe pagar a mano otra vez. Hay que explicarlo, avisar antes del vencimiento y decir qué pasa con fotos, productos y promociones al vencer.
- Política de **reembolso y retracto**. El Reglamento de la Ley 7472 contempla el derecho de retracto en ventas a distancia.
- Qué ocurre si el admin **rechaza** un pago legítimo: plazo y forma de devolución.
- La promesa "Tu suscripción será activada una vez verificado el pago (**hasta 24 h**)" es un compromiso de servicio. ¿Hay alguien verificando los fines de semana?

---

<a id="l-07"></a>
## L-07 🟠 Integridad de las reseñas

Las reseñas son información para el consumidor. Hay tres riesgos:

1. **Censura de quejas legítimas**: el filtro bloquea "me robaron", "estafadores", "que asco", "deberían cerrar" ([U1](02-ui-ux.md)). Una plataforma que suprime sistemáticamente las reseñas negativas presenta una calificación inflada, lo que puede considerarse información engañosa.
2. **El admin puede reescribir reseñas ajenas**: `updateReviewAsAdmin` ([adminReviews.service.ts:379+](../../src/services/adminReviews.service.ts)) cambia `rating` y `comment` de cualquier reseña. La reseña sigue mostrándose con el **nombre del autor original**, sin marca de "editada por moderación" y sin guardar el texto original. Eso es atribuir a una persona algo que no dijo (riesgo de difamación y de manipulación de calificaciones).
3. Ratings manipulables por la API ([S-09](05-seguridad.md#s-09)).

**Recomendación:** que el admin pueda **ocultar o eliminar** (con motivo registrado) pero **no editar** el texto ni la nota. Si se mantiene la edición, guardar el original, una marca visible de "Editada por moderación" y un log de auditoría. Publicar las reglas de moderación en los Términos.

---

<a id="l-08"></a>
## L-08 🟠 Datos personales accesibles públicamente

Ver [S-10](05-seguridad.md#s-10) y [S-18](05-seguridad.md#s-18). Sin iniciar sesión, cualquiera puede descargar nombre completo, segundo apellido, **teléfono personal** y foto de todos los usuarios, y qué negocios marcó cada uno como favoritos. Contradice los Términos (L-03) y el principio de calidad y minimización de la Ley 8968. Si alguien lo explota, sería un incidente de seguridad que habría que notificar.

---

<a id="l-09"></a>
## L-09 🟠 Requisitos de las tiendas de apps

| Requisito | Estado |
|---|---|
| **Borrado de cuenta dentro de la app** y por web (Google Play desde 2024, Apple desde 2022) | ❌ No existe |
| URL pública de política de privacidad | ❌ (L-02) |
| Formulario *Data safety* (Play) / *Privacy Nutrition Labels* (Apple) coherente con el uso real | Pendiente: debe declarar ubicación precisa, fotos, información personal, compras y que hay datos públicos |
| Permisos mínimos | ❌ `RECORD_AUDIO` sin uso, `READ/WRITE_EXTERNAL_STORAGE` obsoletos y permisos de ubicación duplicados en `app.json` |
| Texto de permisos coherente | `locationAlwaysAndWhenInUsePermission` en el plugin de `expo-location` declara un uso **en segundo plano** que la app no tiene (solo `requestForegroundPermissionsAsync`). Apple rechaza apps que piden "Always" sin justificarlo. Usar solo `locationWhenInUsePermission`. |
| Pagos de bienes digitales | Apple (3.1.1) y Google exigen sus sistemas de pago para "contenido o funciones digitales" dentro de la app. Los planes desbloquean funciones de la app (dashboard, más fotos, más productos) y se pagan por SINPE fuera de la tienda. **Riesgo alto de rechazo en App Store.** Hay que evaluarlo con cuidado: las excepciones para servicios B2B o "reader" no aplican claramente. |
| Contenido generado por usuarios | Apple (1.2) exige **filtrar, reportar contenido, bloquear usuarios** y tener un contacto publicado. Hoy no hay "Reportar" en reseñas ni en negocios (L-12). |

---

<a id="l-10"></a>
## L-10 🟡 Transferencia internacional y terceros

| Tercero | Qué recibe | Dónde está |
|---|---|---|
| Supabase (AWS) | Todos los datos | Región del proyecto (verificar; probablemente EE. UU.) |
| OpenStreetMap / Nominatim | Coordenadas GPS del usuario, IP | Reino Unido / UE |
| CARTO (tiles del mapa) | IP, área visitada | EE. UU. / UE |
| unpkg.com (Leaflet) | IP | CDN global |
| Vercel | Tráfico web | EE. UU. |
| Gmail SMTP (Google) | Email, nombre, montos, referencias de pago | EE. UU. |
| Google Fonts (`public/index.html`) | IP de visitantes web | EE. UU. |

La Ley 8968 y su Reglamento exigen informar la transferencia a terceros y obtener el consentimiento correspondiente. Todo esto debe figurar en la Política de Privacidad. Además, usar una cuenta **Gmail personal** para emails transaccionales con datos de pago no es adecuado, ni contractualmente ni en confiabilidad.

---

<a id="l-11"></a>
## L-11 🟡 Precios con descuentos acumulados

`ProductCard` aplica **todas** las promociones en cadena ([U18](02-ui-ux.md)). Si el comercio esperaba aplicar solo la mejor, el precio mostrado en Rutica es menor que el real. El consumidor puede exigir el precio anunciado y el comercio va a culpar a la plataforma. Hay que definir la regla, mostrar el detalle ("−10 % + −20 %") y aclarar en los Términos que el precio lo fija el comercio.

---

<a id="l-12"></a>
## L-12 🟡 Contenido de terceros

- Los usuarios suben fotos de negocios y atracciones que pueden ser de terceros (derechos de autor, imagen de personas).
- No hay botón de **reportar** contenido, negocio o reseña.
- No hay un procedimiento de **retiro por infracción** (aviso y retiro) con plazos ni un contacto designado.
- Las atracciones (lugares públicos) las puede crear cualquier usuario: hay riesgo de información falsa sobre sitios turísticos (horarios, accesos, seguridad).

**Recomendación:** "Reportar" en cada entidad y reseña (tabla `reports` + cola en el admin), una sección de denuncia en los Términos y un email dedicado.

---

<a id="l-13"></a>
## L-13 🟡 Mapas: atribución y políticas de uso

- La atribución "© OpenStreetMap contributors | © CartoDB" está presente, pero en `LeafletMap/mapScripts.ts:96-99`, al cambiar al tile de respaldo (`fallbackUrl`), se hace `removeAttribution(primaryAttribution)`. Hay que verificar que se **agregue** la atribución del proveedor de respaldo. La licencia ODbL de OSM exige atribución visible siempre.
- **CARTO basemaps**: el uso gratuito sin cuenta está limitado (uso no comercial o con límites). Una app con planes pagos es uso comercial. Revisar los términos de CARTO o contratar un proveedor (MapTiler, Stadia, Mapbox).
- **Nominatim**: su política prohíbe el uso intensivo desde apps, exige un `User-Agent` identificativo y como máximo 1 req/s, y pide cachear. Desde cada dispositivo, sin identificación, se incumple. Además es un riesgo de disponibilidad: OSM puede bloquear las peticiones de la app.

---

<a id="l-14"></a>
## L-14 🟡 Menores de edad

No hay edad mínima en los Términos ni verificación. La app incluye pagos, publicación de contenido y geolocalización. Hay que definir la edad mínima (por ejemplo, 18 para vendedores y 13 o más para usuarios) y declararla en las tiendas.

---

<a id="l-15"></a>
## L-15 🟢 Datos personales de contacto del equipo

Los Términos (sección 10) y `SupportScreen` publican dos teléfonos móviles (`+506 8450-1389`, `+506 8707-7994`) y un Gmail. Si son números personales, conviene un número o email institucional, para no exponer al equipo y porque los Términos deben identificar a la entidad, no a personas.

---

<a id="l-16"></a>
## L-16 🟢 PRODHAB

La Ley 8968 y su Reglamento obligan a inscribir ante la Agencia de Protección de Datos de los Habitantes (PRODHAB) ciertas bases de datos con fines de distribución o comercialización. Rutica **publica** datos de personas (perfiles, reseñas) y comercializa visibilidad. Hay que consultar con un abogado si corresponde inscribirla.

---

<a id="l-17"></a>
## L-17 🟢 Licencias y marcas

- **Dependencias**: revisé las 39 dependencias directas: todas MIT/ISC, más OFL-1.1 para la fuente Caveat. En el árbol completo solo aparece `node-forge` (BSD-3 **o** GPL-2.0, a elección) como herramienta de build, que no se distribuye en la app. ✅ Sin conflictos copyleft.
- El repo no tiene archivo `LICENSE`. Para código privado está bien (todos los derechos reservados), pero conviene dejarlo explícito si alguna vez se hace público.
- **Íconos de Facebook, Instagram y TikTok** (`assets/tiktok.svg`, componentes `TikTokIcon` y Lucide): cada marca tiene guías de uso (colores, no modificar el logo). Riesgo bajo, pero hay que respetarlas.
- **Leaflet** (BSD-2) se carga desde unpkg en el WebView. Su licencia exige conservar el aviso de copyright, cosa que hace el propio archivo. ✅

---

## Checklist mínimo antes de publicar en tiendas

- [ ] Datos de pago reales y configurables (L-01).
- [ ] Política de Privacidad y Términos redactados por un abogado, publicados en una URL y enlazados con links que funcionen (L-02, L-03).
- [ ] Checkbox de consentimiento con versión y fecha guardadas (L-04).
- [ ] Precios leídos de la BD (L-05) y condiciones de compra: IVA, factura, vencimiento, reembolso (L-06).
- [ ] El admin oculta reseñas, no las reescribe (L-07).
- [ ] Perfiles sin teléfono público (L-08 / S-10).
- [ ] Borrado de cuenta, permisos mínimos y decisión sobre pagos dentro de la tienda (L-09).
- [ ] Botón "Reportar" (L-09, L-12).
