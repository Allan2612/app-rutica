/**
 * Venta de planes pagos. Apagada mientras Rutica no factura (sin inscripción tributaria):
 * los planes se muestran solo como información y no se puede iniciar una compra.
 * Para activarla: poner true, cargar los datos de pago en `app_settings` y completar la
 * sección de planes de los Términos (IVA, factura, retracto, vendedor).
 */
export const PLANS_FOR_SALE = false;

export const PLANS_NOT_FOR_SALE_MESSAGE =
  'Los planes pagos todavía no están a la venta. Por ahora puedes usar Rutica gratis, con los límites del plan gratuito.';
