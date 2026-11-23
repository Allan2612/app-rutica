# Rutica

App móvil para descubrir lo que hay cerca en Costa Rica: comercios, atracciones, eventos y promociones, con mapa, reseñas y favoritos.

*Mobile app to discover nearby businesses, attractions, events and promotions in Costa Rica. Expo + React Native + Supabase.*

## Qué hace

- **Explorar** comercios, atracciones y eventos cercanos, según la ubicación del usuario.
- **Mapa** con todos los lugares.
- **Promociones** publicadas por los comercios.
- **Reseñas, calificaciones y "me gusta"**, con moderación.
- **Favoritos** y perfil de usuario.
- **Panel para comercios:** cada dueño administra su negocio, sus productos y sus promociones. Hay planes premium.
- **Panel de administración** y soporte.
- **Cuenta:** registro con consentimiento explícito, recuperación de contraseña y eliminación de la cuenta desde la app.

## Stack

Expo 54 · React Native 0.81 · Expo Router · TypeScript · Supabase (Postgres, Auth, Storage, RLS, Edge Functions) · TanStack Query · Zustand · React Hook Form + Zod · expo-location

## Calidad y seguridad

En octubre de 2026 se hizo una **revisión completa** del proyecto: consultas y base de datos, UX, rendimiento, bugs, seguridad, arquitectura y cumplimiento legal. Los informes están en [`docs/auditoria/`](docs/auditoria/00-RESUMEN.md). Ya están corregidos, entre otros:

- **Seguridad:**
  - el contenido de los usuarios se escapa en los mapas y los iframes van con sandbox;
  - se validan los enlaces antes de abrirlos o guardarlos;
  - los términos de búsqueda se escapan en los filtros de PostgREST;
  - todas las rutas de administración están protegidas;
  - el restablecimiento de contraseña solo funciona desde una sesión de recuperación.
- **Base de datos:** una sola migración idempotente ([`2026-10-15_auditoria.sql`](docs/base-de-datos/migraciones/2026-10-15_auditoria.sql)) protege suscripciones y perfiles contra la autoaprobación y la escalada de rol, aplica límites y moderación en la base, y agrega el registro de moderación. Tiene una prueba con PGlite que la aplica dos veces y revisa 28 reglas de seguridad.
- **Rendimiento:**
  - `staleTime` global en React Query y menos recargas al volver a la app;
  - las reseñas se cargan bajo demanda;
  - los conteos se hacen con RPC agregadas.
- **Bugs:**
  - la sesión se conserva completa;
  - se corrigieron los hooks llamados después de un `return`;
  - se corrigieron los selectores de Zustand y la carga de fuentes en Android.
- **Legal:**
  - consentimiento explícito al registrarse;
  - borrador de política de privacidad (Ley 8968);
  - eliminación de la cuenta.
- **CI:** cada push y PR a `main` o `develop` corre ESLint, `typecheck` y la prueba de la migración ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)). Hoy: 0 errores de ESLint y de TypeScript.

## Cómo ejecutarlo

```bash
npm install
cp .env.example .env    # EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

**Base de datos:** se crea en Supabase con [`docs/base-de-datos/esquema-v3.sql`](docs/base-de-datos/esquema-v3.sql) y después las migraciones de [`docs/base-de-datos/migraciones/`](docs/base-de-datos/migraciones/), en orden de fecha (SQL Editor). Para probar la migración en local, sin Docker: [`docs/base-de-datos/pruebas/`](docs/base-de-datos/pruebas/README.md).

```bash
npm run lint
npm run typecheck
```

## Ramas y despliegue

- **`main`:** producción. Se publica en Vercel.
- **`develop`:** integración. Los cambios llegan a `main` por pull request, con el CI en verde.
- Un cambio que necesita una migración de base de datos pasa a `main` **después** de aplicar la migración en la base de producción.

## Estado

Proyecto de curso, con una versión web publicada en Vercel para mostrarla.

## Equipo

- **Allan Vargas Torres:** desarrollo, auditoría y correcciones.
- **James Rivera:** desarrollo.

[LinkedIn de Allan](https://www.linkedin.com/in/allanvargastorres/)
