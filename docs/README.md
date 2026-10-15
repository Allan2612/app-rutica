# Documentación de Rutica

| Carpeta | Contenido |
|---|---|
| [`auditoria/`](auditoria/00-RESUMEN.md) | Auditoría técnica, de seguridad y legal (2026-10) y su plan de corrección |
| [`base-de-datos/`](base-de-datos/) | Esquema de referencia (`esquema-v3.sql`), seed de categorías y migraciones |
| [`base-de-datos/migraciones/`](base-de-datos/migraciones/) | Scripts para ejecutar en Supabase, en orden de fecha |
| [`guias/`](guias/) | Estándares del proyecto y documentación funcional (`DOCUMENTACION_COMPLETA.md`, `MANAGE_STANDARDS.md`) |
| [`email-templates/`](email-templates/README.md) | Plantillas HTML de los correos de Supabase y de las Edge Functions |
| [`legal/`](legal/) | Borradores de textos legales (pendientes de revisión por un abogado) |

> ⚠️ `base-de-datos/esquema-v3.sql` **no** es una copia exacta de producción (faltan funciones, triggers y columnas). Ver [auditoria/01 S6](auditoria/01-queries-y-base-de-datos.md). Los cambios nuevos van en `migraciones/`.
