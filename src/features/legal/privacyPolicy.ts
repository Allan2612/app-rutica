/**
 * Política de Privacidad — BORRADOR técnico (2026-11-24).
 *
 * ⚠️ Pendiente de revisión por un abogado (Ley 8968 y su Reglamento). Describe lo que la app
 * hace realmente según el código. Si cambia algún flujo de datos, actualizar este texto,
 * `docs/legal/politica-privacidad-BORRADOR.md` y PRIVACY_POLICY_VERSION.
 */

export const PRIVACY_POLICY_VERSION = '2026-11-24';

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export const PRIVACY_POLICY: LegalSection[] = [
  {
    title: '1. Responsable',
    paragraphs: [
      'Rutica es responsable del tratamiento de los datos personales recolectados en la aplicación y en su sitio web. Contacto: rutica.info@gmail.com.',
      '[Pendiente: nombre o razón social, cédula y domicilio del responsable.]',
    ],
  },
  {
    title: '2. Datos que recolectamos',
    paragraphs: [
      '• Cuenta: correo electrónico, nombre, apellidos, teléfono (opcional) y foto de perfil (opcional).',
      '• Ubicación: si lo autorizas, tu ubicación aproximada para mostrarte lugares cercanos. Puedes usar la app sin dar este permiso.',
      '• Contenido que publicas: reseñas, calificaciones, favoritos, negocios, productos, eventos, atracciones, promociones e imágenes.',
      '• Uso: clics en los botones de contacto de los negocios (para las estadísticas del dueño del negocio).',
      '• Reportes: cuando reportas un contenido guardamos qué reportaste, el motivo, el detalle que escribas y tu usuario. Solo los ven los administradores; la persona reportada no sabe quién la reportó.',
      '• Pagos de planes: referencia de la transferencia o SINPE que nos indicas. No almacenamos datos de tarjetas ni de cuentas bancarias.',
    ],
  },
  {
    title: '3. Para qué los usamos',
    paragraphs: [
      'Para crear y administrar tu cuenta, mostrar el contenido de la plataforma, moderar publicaciones y atender reportes, verificar pagos de planes, enviarte correos sobre tu cuenta o tus compras y elaborar estadísticas agregadas para los negocios.',
    ],
  },
  {
    title: '4. Qué es público',
    paragraphs: [
      'Tu nombre, primer apellido y foto de perfil se muestran junto a tus reseñas. Tu teléfono y tu correo NO se muestran públicamente. Los datos de contacto que un negocio publica (teléfono, correo, web, redes) son públicos por decisión del negocio.',
    ],
  },
  {
    title: '5. Con quién compartimos datos',
    paragraphs: [
      'No vendemos tus datos. Para funcionar usamos proveedores que procesan datos por nuestra cuenta, algunos fuera de Costa Rica:',
      '• Supabase (base de datos, autenticación y almacenamiento de imágenes).',
      '• OpenStreetMap: Nominatim (convierte coordenadas en provincia, cantón y distrito) y los mapas. Reciben coordenadas o la zona del mapa que ves, y tu dirección IP.',
      '• unpkg (librería de mapas Leaflet) y Google Fonts (tipografía en la versión web): reciben tu dirección IP.',
      '• Brevo (envío de correos: confirmación de cuenta, recuperación de contraseña y avisos sobre compras de planes): recibe tu correo, tu nombre y, en compras, el plan y la referencia de pago.',
      '• Vercel (alojamiento del sitio web): recibe tu dirección IP al visitar el sitio.',
    ],
  },
  {
    title: '6. Tus derechos',
    paragraphs: [
      'Puedes acceder a tus datos y corregirlos desde tu perfil. Puedes eliminar tu cuenta en Configuración → Eliminar cuenta: se borran tu perfil, reseñas, favoritos y el contenido que publicaste. También puedes escribirnos a rutica.info@gmail.com para ejercer tus derechos de acceso, rectificación, supresión u oposición.',
    ],
  },
  {
    title: '7. Conservación y seguridad',
    paragraphs: [
      'Conservamos tus datos mientras tengas una cuenta activa. Al eliminarla, se borran de la base de datos; las copias de respaldo del proveedor se eliminan en sus ciclos normales. Aplicamos controles de acceso por usuario en la base de datos y conexiones cifradas.',
    ],
  },
  {
    title: '8. Menores de edad',
    paragraphs: ['[Pendiente: definir edad mínima de uso y de venta.]'],
  },
  {
    title: '9. Cambios',
    paragraphs: [
      'Si esta política cambia, te lo indicaremos en la app y te pediremos aceptarla de nuevo cuando el cambio sea relevante.',
    ],
  },
];
