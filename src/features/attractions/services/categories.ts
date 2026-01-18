/**
 * @deprecated Este archivo es obsoleto. Usa @/services/categories.service.ts
 * Este archivo se mantiene por compatibilidad pero redirige al servicio centralizado
 */
import { getCategories } from '@/services/categories.service';
import { CategoryItem } from '@/types/entities';

/**
 * @deprecated Use getCategories from '@/services/categories.service' instead
 */
export async function getAttractionCategories(): Promise<CategoryItem[]> {
    return getCategories();
}
