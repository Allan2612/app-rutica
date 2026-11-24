# Pruebas de la migración

`test-migracion.mjs` carga `esquema-v3.sql` en **PGlite** (Postgres en WASM, sin Docker) con stubs de los
esquemas `auth` y `storage` de Supabase, aplica la migración **dos veces** (idempotencia) y prueba las reglas
de seguridad como distintos usuarios (admin, seller, buyer).

```bash
# desde la raíz del repo, sin agregar dependencias al proyecto
npm i --no-save @electric-sql/pglite@0.3.6
node docs/base-de-datos/pruebas/test-migracion.mjs \
  docs/base-de-datos/esquema-v3.sql \
  docs/base-de-datos/migraciones/2026-10-15_auditoria.sql
```

Resultado esperado al 2026-10-15: `migration pass 1: OK`, `migration pass 2: OK`, `28/28 OK`.

> Que pase acá no garantiza que pase en producción: el esquema de referencia no es idéntico al real
> (ver `docs/auditoria/01`, S6). El harness agrega a mano las columnas que la app usa y el script no tiene.
