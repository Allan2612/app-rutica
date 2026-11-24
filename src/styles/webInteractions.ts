/**
 * Hover, foco y micro-animaciones para la web, en una sola hoja de estilos global.
 * React Native Web dibuja los Pressable como elementos con role (button, tab, link…) o, sin
 * accessibilityRole, como div[tabindex="0"]; así estas reglas alcanzan todas las pantallas sin
 * tocar cada componente.
 * - Solo web: en la app nativa no existe `document` y esto no hace nada.
 * - Solo con mouse (hover: hover): en pantallas táctiles no queda un hover "pegado".
 * - Con movimiento reducido del sistema no hay desplazamientos ni animaciones.
 */

import { Platform } from 'react-native';

const INTERACTIVE = [
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="checkbox"]',
  '[role="menuitem"]',
  '[role="switch"]',
  '[tabindex="0"]',
].join(',');

// Tarjetas: elementos pulsables con imagen (comercios, lugares, ofertas, eventos). Se excluye la
// fila de cuenta del panel lateral, que también lleva la foto.
const CARD = ':is([role="button"], [tabindex="0"]):has(img):not([aria-label^="Cuenta"])';

const css = `
@media (hover: hover) {
  ${INTERACTIVE} {
    transition: background-color 160ms ease, box-shadow 200ms ease, transform 200ms ease,
      filter 160ms ease, opacity 160ms ease;
  }
  ${INTERACTIVE.split(',')
    .map((s) => `${s}:not(:has(img)):hover`)
    .join(',')} {
    filter: brightness(1.07);
  }
  ${CARD}:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
  }
  input:hover, textarea:hover { filter: brightness(1.04); }
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  ${CARD}:hover { transform: translateY(-4px); }

  [role="tab"] svg, [role="menuitem"] svg, [role="button"] > svg {
    transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  [role="tab"]:hover svg { transform: scale(1.15) rotate(-6deg); }
  [role="menuitem"]:hover svg { transform: translateX(3px); }
  [role="button"]:hover > svg { transform: scale(1.1); }
  [aria-label="Ocultar menú"]:hover svg { transform: translateX(-3px); }
  [aria-label="Mostrar menú"]:hover svg { transform: translateX(3px); }
}

@media (prefers-reduced-motion: no-preference) {
  [role="tab"][aria-selected="true"] svg { animation: rutica-pop 320ms ease-out; }
}
@keyframes rutica-pop {
  0% { transform: scale(0.85); }
  60% { transform: scale(1.18); }
  100% { transform: scale(1); }
}

${INTERACTIVE.split(',')
  .map((s) => `${s}:focus-visible`)
  .join(',')}, input:focus-visible, textarea:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
`;

export function installWebInteractions() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById('rutica-web-interactions')) return;
  const style = document.createElement('style');
  style.id = 'rutica-web-interactions';
  style.textContent = css;
  document.head.appendChild(style);
}
