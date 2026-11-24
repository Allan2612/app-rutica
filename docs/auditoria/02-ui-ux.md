# 02 · UI / UX

> Auditoría 2026-10-15 · Alcance: `app/`, `src/features/**/screens`, `src/components/**`
> Severidad: 🔴 crítico · 🟠 alto · 🟡 medio · 🟢 bajo

---

## U1 🔴 El filtro de "malas palabras" bloquea reseñas legítimas

[contentModeration.service.ts:219-230](../../src/services/contentModeration.service.ts#L219-L230) busca cada palabra como **subcadena** (`\bpalabra\b|palabra`) y aplica regex sin límites de palabra. Lo probé con el código real:

| Reseña | Resultado |
|---|---|
| "¡Fue un espectáculo increíble!" | ❌ bloqueada (`culo`) |
| "Compré una computadora" | ❌ bloqueada (`puta`) |
| "El vehículo quedó perfecto" | ❌ bloqueada (`culo`) |
| "Tienen buena reputación" | ❌ bloqueada (`puta`) |
| "Precio ridículo de barato" | ❌ bloqueada (`culo`) |
| "Me robaron la billetera en el parqueo, cuidado" | ❌ bloqueada (frase) |
| "Que asco de baño" | ❌ bloqueada (frase) |

Además:
- Las frases "me robaron", "estafadores", "deberían cerrar" y "que asco" bloquean **reseñas negativas honestas**. Eso sesga los ratings hacia arriba y puede ser un problema legal y de confianza (censurar quejas de consumidores).
- El mensaje de error no dice **qué** palabra causó el bloqueo, así que el usuario no sabe qué corregir.
- Solo se aplica a reseñas de negocio, atracción y evento. **Las reseñas de producto no pasan por el filtro.**
- Es solo del lado del cliente: cualquiera puede saltárselo con la API.

**Recomendación:** comparar por **palabra completa** sobre el texto normalizado (`split(/\s+/)` + `Set`), eliminar la lista de "frases" de quejas, mostrar la palabra marcada y, para los casos dudosos, **marcar para revisión** en lugar de bloquear. Llevar la validación a la BD (trigger o Edge Function) para que sea obligatoria.

---

## U2 🔴 Status bar invisible en tema claro

[app/_layout.tsx](../../app/_layout.tsx) fija `<StatusBar barStyle="light-content" translucent />` **siempre**. El tema por defecto es `light` ([themeStore.ts](../../src/store/themeStore.ts)) y el header es blanco (`colors.background.primary`). En el modo por defecto, la hora, la batería y la señal quedan **blanco sobre blanco**.

**Recomendación:** `<StatusBar style={isDark ? 'light' : 'dark'} />` de `expo-status-bar` (ya está instalado), controlado por el tema.

---

## U3 🟠 El modo "Automático" del tema no aplica hasta que el sistema cambie

`setMode('auto')` solo guarda el modo. `effectiveTheme` se actualiza en un `useEffect` que depende de `systemColorScheme`/`isLoaded`, que no cambian. Si el usuario está en "Oscuro" y elige "Automático" con el sistema en claro, la app **sigue oscura**.

**Recomendación:** en `setMode('auto')` leer `Appearance.getColorScheme()` y asignar `effectiveTheme` en ese momento.

---

## U4 🟠 Errores de red se muestran como "no hay resultados"

Los servicios devuelven `[]` o `null` cuando falla la query (ver [Q17](01-queries-y-base-de-datos.md#Q17)). Consecuencias:

- Listados: sin conexión aparece "No hay comercios disponibles. Los comercios activos aparecerán aquí", y el usuario cree que la app está vacía.
- Detalle de negocio: `getBusinessDetail` devuelve `null` ante cualquier error y la UI muestra "no encontrado".
- Home: el estado de error con "Reintentar" ([HomeScreen.tsx](../../src/features/home/screens/HomeScreen/HomeScreen.tsx)) **nunca se activa**, porque `getFeatured*` capturan el error y devuelven `[]`.

**Recomendación:** que los servicios lancen el error y que haya un componente común `<ErrorState onRetry />` en todos los listados y detalles, distinto del `<EmptyState />`.

---

## U5 🟠 Feed de atracciones: tocar una tarjeta no hace nada

[AttractionsList.tsx:23-29](../../src/components/attractions/AttractionsList/AttractionsList.tsx#L23-L29): `handleAttractionPress` está vacío ("TODO: Navegar a detalle de atracción cuando exista"), pero la ruta `app/(app)/(tabs)/attractions/[id]` **ya existe** y Home sí navega a ella. El `AttractionPost` es un `Pressable` con `onPress`, así que el usuario toca, no pasa nada y no hay feedback.

---

## U6 🟠 La política de re-moderación al editar es incoherente

> **Corregido después de leer el script completo de RLS.** La versión anterior de este punto estaba equivocada.

[updateBusiness.service.ts:459](../../src/features/business/services/updateBusiness.service.ts#L459) intenta poner `moderation_status_bus: 'pending'` en cada edición, pero el trigger `protect_business_fields` **revierte** ese campo cuando el usuario no es admin. En la práctica, editar **no** oculta el negocio: los cambios se publican **sin revisión**. El código y la BD tienen intenciones opuestas, y nadie sabe cuál es la regla real.

- Desde UX: el dueño no sabe si su cambio quedó publicado o espera revisión.
- Desde seguridad: es un bypass de moderación. Ver [05-seguridad S-06](05-seguridad.md#s-06).

**Recomendación:** definir la regla en un solo lugar (el trigger de la BD). Por ejemplo, volver a `pending` solo si cambian nombre, descripción, imágenes o enlaces, y decírselo al usuario en el toast ("Tu cambio será revisado antes de publicarse").

---

## U7 🟠 Negocios premium pagan 10 fotos pero se muestran 3

[businessDetail.service.ts](../../src/features/business/services/businessDetail.service.ts) hace `.slice(0, 3)` sobre la galería. El plan `gallery_business` se vende como "Hasta 10 fotos en galería". El vendedor paga, sube 10 y el público ve 3.

---

## U8 🟠 Filtros de búsqueda: la ubicación se comporta distinto del resto

En `SearchFilterModal` el texto y las categorías son estado local que se aplica con "Aplicar". La pestaña Ubicación (`LocationFilterTab`) escribe **directo en el store global**:

- Cerrar el modal con la X no revierte el cambio de ubicación.
- "Limpiar" borra la ubicación global (afecta header, home y las demás pestañas).
- Cada pestaña (Comercios/Promociones, Atracciones/Eventos) guarda su propio texto y categorías, pero comparte la ubicación.

**Recomendación:** que la ubicación del modal también sea borrador local, aplicado al confirmar. Mostrar los filtros activos como chips sobre la lista, con una "x" para quitar cada uno (hoy solo cambia el color del ícono de lupa).

---

## U9 🟠 Formularios de registro e inicio de sesión

[RegisterScreen.tsx](../../src/features/auth/screens/RegisterScreen/RegisterScreen.tsx), [LoginScreen.tsx](../../src/features/auth/screens/LoginScreen/LoginScreen.tsx):

- **Bug:** `handleRegister` usa `useCallback` sin `profilePhoto` en las dependencias. Si el usuario elige la foto **después** de llenar los campos, el callback tiene la versión vieja y la foto se pierde en silencio.
- No se valida el formato de email ni de teléfono. La contraseña mínima es de 6 caracteres sin más reglas.
- No hay botón de "mostrar contraseña".
- No hay `returnKeyType`/`onSubmitEditing`: Enter no pasa al siguiente campo ni envía el formulario (solo 3 usos en toda la app).
- Los errores de Supabase se muestran crudos y en inglés ("Email not confirmed", "User already registered"). Solo se traduce `Invalid`.
- Después del registro dice "Ahora puedes iniciar sesión", pero si la confirmación por email está activa el login va a fallar. Hay que decir "Revisa tu correo para confirmar".
- El botón "atrás" del registro navega a `/manage`, cuando lo esperable es volver.
- `setTimeout(..., 500/1500)` antes de navegar (30 usos de `setTimeout` en la app): es lento y frágil.
- La foto de perfil del registro se guarda como **URI local** "pendiente" y se sube en el primer login. En web es un `blob:`, que deja de existir al recargar. En móvil puede ser un archivo de caché que el sistema borra. La subida además **bloquea** el login (`await uploadPendingProfilePhoto`).

**Recomendación:** usar `react-hook-form` + `zod` (ya están en `package.json` y no se usan) con un esquema por formulario y un diccionario de errores de Supabase en español.

---

## U10 🟠 Formularios de gestión (negocio, evento, atracción)

- La validación solo cubre nombre, categoría y ubicación. Email, URL y teléfono se aceptan con cualquier formato (luego `website` se "repara" anteponiendo `https://`).
- Cualquier fallo muestra "Por favor intenta de nuevo o contacta soporte" y se pierde la causa real (por ejemplo, el fallo de RLS de ubicación de [Q14](01-queries-y-base-de-datos.md#Q14)).
- Si falla la subida de imágenes o categorías, el usuario ve "¡Comercio creado!" (ver Q15).
- No hay progreso de subida: con 5 o 6 fotos en 3G el botón queda "cargando" decenas de segundos sin feedback.
- Las imágenes se suben al **tamaño original** (calidad 0.8 sin redimensionar; una foto de 12 MP puede pesar 3-5 MB). Ver [E5](03-eficiencia-y-rendimiento.md#E5).
- `ConfirmExitDialog` existe en `components/manage`. Hay que verificar que proteja todos los formularios contra la salida con gesto o con el botón atrás de Android (`usePreventRemove`).

---

## U11 🟠 Accesibilidad prácticamente inexistente

| Métrica | Valor |
|---|---|
| `Pressable`/`TouchableOpacity` | 362 |
| `accessibilityLabel` | **3** |
| `accessibilityRole` | 4 |
| `hitSlop` | 5 |

- Los botones de solo ícono (lupa, corazón de favorito, X de cerrar, avatar del header, filtros del mapa) se leen como "botón" en TalkBack/VoiceOver, sin indicar qué hacen.
- Hay íconos de 16-18 px con área táctil menor a 44×44.
- El texto `text.tertiary` (#9ca3af sobre #fff) tiene un contraste de ~2.5:1, que no cumple WCAG AA (4.5:1). Se usa para subtítulos y placeholders informativos.
- Las estrellas de rating no tienen texto alternativo ("4,5 de 5").

**Recomendación:** un componente `IconButton` con `accessibilityLabel` obligatorio, `hitSlop` y `accessibilityRole="button"`. Oscurecer `text.tertiary` en tema claro (por ejemplo #6b7280 para texto y la tonalidad actual solo para elementos decorativos).

---

## U12 🟡 `Alert.alert` no funciona en web

React Native Web no implementa `Alert.alert`: no hace nada. Hay 12 usos, entre ellos los mensajes de "Límite alcanzado" de imágenes, "Permisos requeridos" y la confirmación de "Reseña eliminada/actualizada" del admin ([AdminReviewsScreen.tsx:50-83](../../src/features/admin/screens/AdminReviewsScreen/AdminReviewsScreen.tsx#L50-L83)). En la versión web el usuario no recibe feedback. Hay que unificar con `Toast` o con un `ConfirmDialog` propio, que ya existen.

---

## U13 🟡 Guards de rol: recargar una ruta protegida expulsa al home

[RequireRole.tsx](../../src/features/auth/guards/RequireRole.tsx) redirige si `role` es `null`, **incluso mientras `authStore.isLoading` es `true`**. Si el usuario abre o recarga `/manage/admin/...` en web, o entra por deep link, el rol aún no cargó, `isAllowed=false` y termina en home. Hay que esperar `isLoading === false` antes de decidir y mostrar un spinner mientras tanto.

También:
- `manage/attractions` y `manage/events` permiten `['buyer','seller','admin']`: un usuario con rol `premium` o `user` queda fuera.
- `manage/admin/reviews.tsx` **no tiene guard** (las otras 4 pantallas de admin sí).

---

## U14 🟡 Header y fuentes: parpadeo al iniciar

`BaseHeader` devuelve `null` hasta que carga la fuente Caveat (`useFonts` se llama en `app/index.tsx`, `BaseHeader` y otros). En el primer render de cada tab el header **no existe** y el contenido salta. Hay que cargar las fuentes una sola vez en `app/_layout.tsx` con `SplashScreen.preventAutoHideAsync()` y ocultar el splash cuando estén listas (también sirve para esperar el `authStore`).

---

## U15 🟡 Pull-to-refresh "fantasma" en Home

`isRefreshing` en Home es `isFetching` de cualquiera de las 5 queries. Cada refetch de fondo (al enfocar, al volver de background) **muestra el spinner de pull-to-refresh** aunque el usuario no tiró de la lista. Hay que usar un flag manual, como ya se hace en `BusinessesScreen`.

---

## U16 🟡 Datos falsos por defecto en `BusinessCard`

[BusinessCard.tsx:37-38](../../src/components/business/BusinessCard/BusinessCard.tsx#L37-L38): `rating = 4.5, reviewCount = 20` por defecto. Si alguna pantalla no pasa la prop, se muestra un negocio con **4.5★ y 20 reseñas inventadas**. El default debe ser `0`/`undefined` y la tarjeta debe mostrar "Sin reseñas".

---

## U17 🟡 Nombres de autor "null Pérez"

`useAttractions` y `useEvents` construyen `` `${first_name} ${last_name}` `` sin filtrar `null`. Si el perfil no tiene apellido aparece "María null". En `home.service.ts` sí se filtra. Hay que unificar en un helper `formatPersonName()`.

---

## U18 🟡 Precio con descuentos acumulados

[ProductCard.tsx:69-87](../../src/components/business/ProductCard/ProductCard.tsx#L69-L87) aplica **todas** las promociones activas en cadena (porcentajes y luego fijos). Con "10 % en todo" + "20 % en bebidas" se muestra un 28 % de descuento, cuando lo habitual es aplicar **la mejor** promoción. El precio que ve el cliente puede no coincidir con el que cobra el comercio. Hay que definir la regla de negocio y mostrarla.

---

## U19 🟡 Listas con ubicación activa pierden virtualización

Sin ubicación, `BusinessesList`/`AttractionsList` usan `FlatList`. **Con** ubicación activa (el caso normal después de detectar GPS), se renderiza un `ScrollView` con `.map()` de **todos** los ítems (sección local + "otros lugares"). Con 200 negocios se montan 200 tarjetas con imagen. Además el usuario recibe el país entero bajo "Otros lugares" sin paginación. Ver E1/E2.

**Recomendación:** `SectionList` (o FlashList con headers) y cargar "otros lugares" bajo demanda ("Ver más fuera de X").

---

## U20 🟢 Detalles menores

- Los pantallazos de carga son `ActivityIndicator` sueltos (77 usos), sin skeletons. En listas de tarjetas con imagen, un skeleton reduce la sensación de espera.
- No hay estado offline (no se usa NetInfo ni `onlineManager` de React Query).
- `app.json`: `userInterfaceStyle: "light"` desactiva el modo oscuro del sistema en iOS/Android aunque la app lo soporta (debe ser `"automatic"`). El splash es negro (`#000000`) y el tema por defecto blanco, lo que produce un salto visual.
- `public/index.html` pone `background-color: #0a0a0a` en el body: en web hay un flash negro antes del tema claro.
- El compartir de atracción en web arma `${origin}/(app)/(tabs)/attractions/${id}`. Los segmentos de grupo `(app)` normalmente no van en la URL pública: hay que verificar que el link abra y usar `/attractions/${id}`.
- 213 `style={{...}}` inline y 278 colores hex sueltos en `.tsx`: el tema no está centralizado y hay pantallas que no respetan el modo oscuro (por ejemplo, el Toast del root siempre es `#1a1a1a`).
- `LocationDropdown`/GPS: el reverse geocoding de Nominatim devuelve nombres como "Cantón de Pérez Zeledón" o "Provincia San José", que pueden **no coincidir** con los nombres de la BD. En ese caso el split "En tu zona / Otros lugares" queda vacío. Hay que mapear a IDs del catálogo (ver Q2/Q14).

---

## U21 🟠 La fuente Caveat no carga en el APK (Android)

Reportado por el equipo y confirmado en el código. El logo "Rutica", el "Bienvenido a Rutica" y el saludo del Home salen con la fuente del sistema en el APK.

Causas:
1. **`fontWeight: '700'` junto con una fuente personalizada de un solo peso.** En `app/index.tsx:63`, `BaseHeader.tsx:108` y `HeroWelcome.tsx:84` se usa `{ fontFamily: 'Caveat_700Bold', fontWeight: '700' }`. En Android, React Native busca la variante *bold* de la familia `Caveat_700Bold`. Esa variante no existe (el archivo ya es bold, pero está registrado como peso normal), así que **cae a Roboto**. En iOS y web funciona, por eso solo falla en el APK.
2. **Carga en tiempo de ejecución, repetida en 3 componentes** (`useFonts` en `app/index.tsx`, `BaseHeader` y `HeroWelcome`). La fuente no va embebida en el binario: el header devuelve `null` hasta que carga (U14) y, si falla, `HeroWelcome` usa el fallback.

**Fix:** embeber la fuente en el build con el config plugin `expo-font` (`fonts: [...]`), cargarla una sola vez en `app/_layout.tsx` con el splash retenido, y **no** aplicar `fontWeight` en nativo cuando se usa una familia personalizada.
