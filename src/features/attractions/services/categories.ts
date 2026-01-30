/**
 * @deprecated Este archivo es obsoleto. Usa @/services/categories.service.ts
 * Este archivo se mantiene por compatibilidad pero redirige al servicio centralizado
 */
import { getCategoriesRaw } from '@/services/categories.service';
import { Category } from '@/types/entities';

/**
 * @deprecated Use getCategoriesRaw from '@/services/categories.service' instead
 */
export async function getAttractionCategories(): Promise<Category[]> {
    return getCategoriesRaw();
}
