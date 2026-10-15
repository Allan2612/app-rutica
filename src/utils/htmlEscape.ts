/**
 * Helpers para insertar datos del usuario en HTML generado (mapas Leaflet en WebView/iframe).
 * Cualquier texto que venga de la BD (nombres, teléfonos) debe pasar por aquí.
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapa texto para usarlo como contenido HTML o valor de atributo. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/**
 * Serializa un valor para incrustarlo dentro de un <script>.
 * JSON.stringify no escapa `</script>`, lo que permite cerrar el bloque e inyectar código.
 */
export function toScriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .split(LINE_SEPARATOR)
    .join('\\u2028')
    .split(PARAGRAPH_SEPARATOR)
    .join('\\u2029');
}

/** Script JS (como string) con una función `esc` equivalente a escapeHtml, para usar dentro del HTML. */
export const ESC_FUNCTION_JS = `
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}`;

/** Rutas a las que el mapa puede pedir navegar. */
const MAP_ROUTE_PATTERN =
  /^(\/\(app\)\/\(tabs\))?\/(businesses|attractions|events)\/[0-9a-f-]{36}(\?from=maps)?$/i;

export function isAllowedMapRoute(route: unknown): route is string {
  return typeof route === 'string' && MAP_ROUTE_PATTERN.test(route);
}
