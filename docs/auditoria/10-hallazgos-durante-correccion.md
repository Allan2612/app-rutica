# 10 · Hallazgos durante la corrección

> Cosas nuevas que aparecieron mientras se aplicaba el [plan](09-plan-de-correccion.md). Cada una indica si quedó corregida en la rama o si queda pendiente.

| # | Hallazgo | Dónde | Estado |
|---|----------|-------|--------|
| H-01 | El dashboard premium mostraba 0 favoritos: desde que los likes son privados (S-18), el dueño solo veía los suyos | `premiumDashboard.service.ts` | ✅ RPC `get_owner_like_buckets/totals` (5.17) |
| H-02 | El contador de likes de reseñas de eventos contaba solo los likes propios | `eventReviewLikes.service.ts` | ✅ RPC `get_like_counts` |
| H-03 | El filtro de ubicación de los listados no filtraba: `.eq` sobre una tabla embebida sin `!inner` solo filtra el embed | servicios de listado | ✅ filtro por IDs en el servidor (5.15) |
| H-04 | Edge Functions de correo con `verify_jwt` apagado y destinatario libre: cualquiera podía mandar correos con la cuenta de Rutica | `supabase/functions` | ✅ código en el repo, JWT obligatorio, destinatario sale de la sesión o de la BD; desplegadas |
| H-05 | Auth aceptaba contraseñas de 6 caracteres y permitía cambiar la contraseña sin reautenticarse | config de Auth | ⏳ se aplica al publicar (mínimo 8, cambio seguro) |
| H-06 | Políticas heredadas con `auth.role() = 'authenticated'` anulaban a las de dueño (las políticas se combinan con OR): cualquier cuenta podía borrar o reemplazar fotos de cualquier comercio (tabla y bucket) y mover la ubicación de cualquier comercio, evento o atracción | `business_images`, `locations`, `storage.objects` | ✅ migración 2026-11-24, sección 0; se aplica al publicar |
| H-07 | El mapa mostraba "API KEY REQUIRED": los tiles de CARTO piden clave y devuelven 200 con una marca de agua, así que el respaldo nunca se activaba | `mapConfig.ts` | ✅ tiles de OpenStreetMap |
| H-08 | Los correos no salían: `denomailer` no funciona en Deno 2 | Edge Functions | ✅ nodemailer |
| H-09 | Siete funciones de perfil usaban la tabla `profile_premium`, que ya no existe (código muerto que fallaría al llamarse) | `profile.service.ts` | ✅ eliminadas (aparecieron al regenerar tipos) |
| H-10 | El respaldo de `getLikeCounts` contaba filas, lo que con likes privados devuelve solo los propios | `likeCounts.service.ts` | ✅ eliminado |
| H-11 | La prueba de migración en PGlite no hacía fallar el CI cuando un chequeo fallaba | `test-migracion.mjs` | ✅ sale con código 1 |
| H-12 | `getInitials` devolvía "Aundefined" con espacios dobles en el nombre | helpers de reseñas | ✅ helper compartido `getNameInitials` |
| H-13 | Los Términos seguían prometiendo cosas que el sistema no hace (L-03) y publicaban un correo sin aclarar plazos | `TermsScreen.tsx` | ✅ reescritos (4.8); decisiones pendientes marcadas |
