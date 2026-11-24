import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Pruebas unitarias de lógica pura (servicios, helpers, validación). La UI se prueba a mano / smoke.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url).href) },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
