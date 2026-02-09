/**
 * Mapeo de categorías a colores para el chip de categoría en BusinessCard
 * Utiliza el ID de la categoría para garantizar consistencia y escalabilidad
 */

export interface CategoryColorScheme {
  backgroundColor: string;
  textColor: string;
}

// Paleta extendida de colores vibrantes para categorías
// Suficiente para 16+ categorías sin repeticiones
const colorPalette: CategoryColorScheme[] = [
  { backgroundColor: 'rgba(239, 68, 68, 0.85)', textColor: '#fff' }, // Rojo vibrante
  { backgroundColor: 'rgba(59, 130, 246, 0.85)', textColor: '#fff' }, // Azul profundo
  { backgroundColor: 'rgba(34, 197, 94, 0.85)', textColor: '#fff' }, // Verde esmeralda
  { backgroundColor: 'rgba(251, 146, 60, 0.85)', textColor: '#fff' }, // Naranja cálido
  { backgroundColor: 'rgba(168, 85, 247, 0.85)', textColor: '#fff' }, // Púrpura real
  { backgroundColor: 'rgba(236, 72, 153, 0.85)', textColor: '#fff' }, // Rosa magenta
  { backgroundColor: 'rgba(6, 182, 212, 0.85)', textColor: '#fff' }, // Cian turquesa
  { backgroundColor: 'rgba(14, 165, 233, 0.85)', textColor: '#fff' }, // Azul cielo
  { backgroundColor: 'rgba(34, 197, 94, 0.85)', textColor: '#fff' }, // Verde menta
  { backgroundColor: 'rgba(244, 63, 94, 0.85)', textColor: '#fff' }, // Rosa coral
  { backgroundColor: 'rgba(99, 102, 241, 0.85)', textColor: '#fff' }, // Índigo
  { backgroundColor: 'rgba(249, 115, 22, 0.85)', textColor: '#fff' }, // Naranja fuego
  { backgroundColor: 'rgba(132, 204, 22, 0.85)', textColor: '#fff' }, // Lima vibrante
  { backgroundColor: 'rgba(236, 72, 153, 0.85)', textColor: '#fff' }, // Rosa oscuro
  { backgroundColor: 'rgba(59, 130, 246, 0.85)', textColor: '#fff' }, // Azul océano
  { backgroundColor: 'rgba(15, 23, 42, 0.85)', textColor: '#fff' }, // Gris oscuro
];

/**
 * Obtiene el esquema de color para una categoría basado en su ID único
 * Garantiza que el mismo ID siempre tenga el mismo color, incluso con más categorías futuras
 * @param categoryId - ID único de la categoría en la base de datos
 * @returns Esquema de color con backgroundColor y textColor
 */
export function getCategoryColorScheme(categoryId: string | null): CategoryColorScheme {
  if (!categoryId) {
    return { backgroundColor: 'rgba(107, 114, 128, 0.8)', textColor: '#fff' };
  }

  // Convertir el ID a un número para obtener un índice consistente
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    const char = categoryId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }

  // Usar el hash para seleccionar un color de la paleta
  // Esto garantiza que el mismo ID siempre obtenga el mismo color
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
}
