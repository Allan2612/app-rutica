/**
 * @deprecated Use useCategories from '@/hooks/useCategories' instead
 * Este hook se mantiene por compatibilidad pero redirige al hook centralizado
 */
import { useCategories } from '@/hooks/useCategories';

export function useAttractionCategories() {
    return useCategories();
}
