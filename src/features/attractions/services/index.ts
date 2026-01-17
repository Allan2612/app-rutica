export { getUserAttractions } from './getUserAttractions.service';
export type { UserAttraction } from './getUserAttractions.service';

export { createAttractionComplete } from './createAttraction.service';
export type { CreateAttractionData } from './createAttraction.service';

export { deleteUserAttraction } from './deleteAttraction.service';

export { getAttractionById, updateAttractionComplete } from './updateAttraction.service';
export type { AttractionDetailForEdit, UpdateAttractionData } from './updateAttraction.service';

/**
 * @deprecated Use getCategories from '@/services/categories.service' and CategoryItem from '@/types/entities'
 */
export { getAttractionCategories } from './categories';
