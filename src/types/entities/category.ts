/**
 * Categoría del sistema - Tabla central: categories
 * 
 * Esta tabla es compartida por todas las entidades del sistema:
 * - Business (via business_category_map)
 * - Events (via event_category_map)
 * - Attractions (via attraction_category_map)
 * - Products (via product_category_map)
 * - Promotions (via promotion_category_map)
 */
export interface Category {
  id_cat: string;
  name_cat: string;
  created_at_cat?: string;
}

/**
 * Formato transformado para uso en componentes/UI
 * Convierte de snake_case (BD) a objetos más amigables
 */
export interface CategoryItem {
  id: string;
  name: string;
}

/**
 * Tabla de mapeo genérica para relaciones many-to-many
 * Cada entidad tiene su propia tabla:
 * - business_category_map (BCM)
 * - event_category_map (ECM)
 * - attraction_category_map (ACM)
 * - product_category_map (PCM)
 * - promotion_category_map (PCR)
 */
export interface CategoryMap {
  entity_id: string;    // business_id_bcm, event_id_ecm, etc.
  category_id: string;  // category_id_bcm, category_id_ecm, etc.
}

/**
 * Helper: Convierte Category (BD) a CategoryItem (UI)
 */
export function categoryToItem(category: Category): CategoryItem {
  return {
    id: category.id_cat,
    name: category.name_cat,
  };
}

/**
 * Helper: Convierte array de Categories a CategoryItems
 */
export function categoriesToItems(categories: Category[]): CategoryItem[] {
  return categories.map(categoryToItem);
}
