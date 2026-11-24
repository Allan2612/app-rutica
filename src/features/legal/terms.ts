/**
 * Términos y Condiciones — BORRADOR (2026-11-24).
 *
 * ⚠️ Pendiente de revisión por un abogado y, en la sección de planes, por un contador
 * (IVA, factura electrónica, retracto). Describe lo que el sistema hace hoy. Los textos entre
 * corchetes son decisiones del responsable que faltan. Si cambia algún flujo, actualizar este
 * texto y TERMS_VERSION.
 */
import type { LegalSection } from './privacyPolicy';

export const TERMS_VERSION = '2026-11-24';

export const TERMS: LegalSection[] = [
  {
    title: '1. Introducción',
    paragraphs: [
      'Bienvenido a Rutica. Al acceder y utilizar nuestra aplicación y plataforma web, aceptas estos Términos y Condiciones. Te recomendamos leerlos antes de usar el servicio.',
      'Rutica es una plataforma para descubrir negocios, eventos y atracciones en Costa Rica. Si no estás de acuerdo con estos términos, no utilices la aplicación.',
    ],
  },
  {
    title: '2. Uso de la plataforma',
    paragraphs: [
      'Al usar Rutica te comprometes a:',
      '• Dar información veraz y actualizada al registrarte.',
      '• No usar la plataforma para fines ilegales o no autorizados.',
      '• No intentar acceder a cuentas de otras personas.',
      '• No publicar contenido ofensivo, difamatorio, obsceno o que infrinja derechos de terceros.',
      '• No manipular calificaciones o reseñas.',
      '• Mantener la confidencialidad de tu contraseña.',
    ],
  },
  {
    title: '3. Cuentas',
    paragraphs: [
      'Algunas funciones requieren una cuenta con un correo válido y una contraseña de al menos 8 caracteres. Eres responsable de la actividad que ocurra en tu cuenta.',
      'Podemos suspender o eliminar cuentas que incumplan estos términos o se usen de forma fraudulenta.',
      'Puedes eliminar tu cuenta cuando quieras desde Configuración → Eliminar mi cuenta. Se borran tu perfil y el contenido que publicaste.',
    ],
  },
  {
    title: '4. Contenido que publicas',
    paragraphs: [
      'Puedes publicar reseñas, calificaciones e imágenes, y registrar negocios, productos, eventos, atracciones y promociones. Al hacerlo:',
      '• Nos das una licencia no exclusiva para mostrar ese contenido dentro de la plataforma mientras esté publicado.',
      '• Declaras que el contenido es tuyo o que tienes permiso para publicarlo, incluidas las fotos de personas y marcas.',
      '• Aceptas que un administrador lo revise antes de mostrarlo. Los cambios importantes en contenido ya aprobado vuelven a revisión.',
      'Podemos retirar contenido inapropiado, falso o que incumpla estos términos.',
    ],
  },
  {
    title: '5. Reportes y retiro de contenido',
    paragraphs: [
      'Cualquier persona con cuenta puede reportar un negocio, evento, atracción o reseña con el botón "Reportar este contenido" o el ícono de bandera. Un administrador revisa cada reporte y, si corresponde, edita, oculta o elimina el contenido.',
      'Si un contenido usa tus fotos, tu marca o tu imagen sin permiso, escríbenos a rutica.app@gmail.com indicando el enlace y tu relación con el material. Lo retiraremos mientras se aclara.',
    ],
  },
  {
    title: '6. Planes pagos',
    paragraphs: [
      '• Precios: los planes se muestran en colones en la aplicación antes de pagar. [Pendiente de confirmar con un contador: si el precio incluye IVA (13 %) y la emisión de comprobante electrónico.]',
      '• Pago: se hace por SINPE Móvil o transferencia, fuera de la aplicación. Indicas la referencia del pago y un administrador la verifica a mano. El plan se activa cuando se confirma el pago; te avisamos por correo si se aprueba o se rechaza.',
      '• Duración: los planes marcados como mensuales duran un mes desde su aprobación y no se cobran solos; para seguir usándolos debes pagar de nuevo. Los paquetes de pago único no vencen.',
      '• Al vencer un plan mensual pierdes sus funciones y los límites vuelven a los gratuitos para lo que crees desde ese momento. Lo que ya publicaste no se borra.',
      '• Pagos rechazados: si no podemos verificar un pago te lo indicamos con el motivo. Si el dinero llegó y no podemos activar el plan, lo devolvemos por el mismo medio. [Pendiente: plazo de devolución.]',
      '• Retracto y reembolsos: [Pendiente de revisión legal: condiciones del derecho de retracto en ventas a distancia (Reglamento a la Ley 7472) y casos de reembolso.]',
      '• Vendedor: [Pendiente: nombre o razón social, cédula y domicilio de quien vende los planes.]',
    ],
  },
  {
    title: '7. Precios y ofertas de los negocios',
    paragraphs: [
      'Rutica no vende los productos ni servicios de los negocios. Los precios, descuentos y condiciones los fija y actualiza cada negocio, que responde por ellos. Si ves un precio incorrecto, avísale al negocio o repórtalo.',
    ],
  },
  {
    title: '8. Privacidad',
    paragraphs: [
      'Cómo tratamos tus datos, con quién los compartimos y cómo ejercer tus derechos está en la Política de Privacidad, que forma parte de estos términos.',
    ],
  },
  {
    title: '9. Propiedad intelectual',
    paragraphs: [
      'El diseño, código, logotipos y marcas de Rutica pertenecen a sus autores. No se permite reproducirlos ni usarlos con fines comerciales sin autorización escrita.',
    ],
  },
  {
    title: '10. Limitación de responsabilidad',
    paragraphs: [
      'Rutica es una plataforma de información y descubrimiento. No respondemos por:',
      '• La veracidad del contenido que publican negocios o usuarios.',
      '• La calidad de los productos o servicios de los negocios.',
      '• Interrupciones temporales del servicio por mantenimiento o causas ajenas a nuestro control.',
      'Nada de lo anterior limita los derechos que te reconoce la Ley 7472 de Promoción de la Competencia y Defensa Efectiva del Consumidor.',
    ],
  },
  {
    title: '11. Cambios a estos términos',
    paragraphs: [
      'Si estos términos cambian, lo indicaremos en la aplicación con la fecha de la nueva versión y te pediremos aceptarlos de nuevo cuando el cambio sea relevante.',
    ],
  },
  {
    title: '12. Legislación aplicable',
    paragraphs: [
      'Estos términos se rigen por las leyes de la República de Costa Rica. Cualquier disputa se someterá a los tribunales competentes de Costa Rica.',
    ],
  },
  {
    title: '13. Contacto',
    paragraphs: [
      'Si tienes preguntas sobre estos términos, puedes escribirnos o llamarnos:',
      '• Correo electrónico: rutica.app@gmail.com',
      '• Teléfono: +506 8450-1389',
      '• Teléfono: +506 8707-7994',
    ],
  },
];
