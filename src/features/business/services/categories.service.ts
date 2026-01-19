/**
 * @deprecated Este archivo es obsoleto. Usa @/services/categories.service.ts
 * Este archivo se mantiene por compatibilidad pero todas las funciones redirigen al servicio centralizado
 */
import { getCategories as getCategoriesCore } from '@/services/categories.service';
import { CategoryItem } from '@/types/entities';

/**
 * @deprecated Use getCategories from '@/services/categories.service' instead
 */
export async function getCategories(): Promise<CategoryItem[]> {
    return getCategoriesCore();
}
