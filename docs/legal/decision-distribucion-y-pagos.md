# Decisión: distribución de la app y cobro de planes (auditoría 4.10)

**Fecha:** 2026-11-24 · **Estado:** vigente · **Revisar:** antes de publicar en Google Play o App Store

## Contexto

Los planes de Rutica (galerías, paquete de productos, promociones, dashboard, Premium Completo) desbloquean funciones dentro de la app y se pagan por SINPE Móvil o transferencia, con verificación manual del admin. Apple (guía 3.1.1) y Google Play exigen su propio sistema de pagos para vender "contenido o funciones digitales" dentro de una app distribuida en sus tiendas. Las excepciones (servicios B2B, apps "reader", bienes físicos) no aplican con claridad. Ver hallazgo L-09 en `docs/auditoria/07-legal-y-cumplimiento.md`.

## Decisión

1. **Hoy Rutica se distribuye solo como app web** (https://rutica.avt.codes) y, si hace falta en Android, como APK fuera de la tienda. En ese canal el cobro por SINPE es válido.
2. **No se publica en App Store ni en Google Play** mientras los planes se cobren fuera de la tienda.
3. Si se decide publicar en una tienda, antes hay que elegir una de estas opciones:
   - a) Cobrar los planes dentro de la app con el sistema de la tienda (Apple In-App Purchase / Google Play Billing). La comisión es de 15 % a 30 %; hay que ajustar precios y conciliar con el flujo de aprobación actual.
   - b) Publicar una versión de la app **sin compra**: el usuario ve sus planes, pero no puede comprarlos ni ver precios ni enlaces de pago dentro de la app. Las tiendas revisan esto con lupa.
   - c) Mantener solo la web (opción actual).

## Qué más falta para una tienda (no bloquea la web)

- Formularios *Data safety* (Play) y *Privacy Nutrition Labels* (Apple) coherentes con la Política de Privacidad.
- URL pública de la política: la pantalla `/privacy` de la web ya sirve.
- Contenido generado por usuarios (Apple 1.2): el reporte de contenido y la cola de revisión del admin ya existen (4.9). Falta **bloquear usuarios**.
- Borrado de cuenta dentro de la app: ya existe (Configuración → Eliminar mi cuenta).

## Consecuencias

- Las pantallas de compra pueden seguir mostrando precios y datos de SINPE en la web.
- Cualquier build para tienda debe partir de esta decisión: revisar los puntos de "Qué más falta" y elegir a), b) o c).
