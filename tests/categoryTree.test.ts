import { describe, expect, it } from 'vitest';
import { buildCategoryTree, normalizeForSearch, withDescendants } from '../src/utils/categoryTree';

const cats = [
  { id: 'salud', name: 'Salud', parentId: null },
  { id: 'odonto', name: 'Odontología', parentId: 'salud' },
  { id: 'orto', name: 'Ortodoncia', parentId: 'odonto' },
  { id: 'nutri', name: 'Nutrición', parentId: 'salud' },
  { id: 'comida', name: 'Comida', parentId: null },
  { id: 'huerfana', name: 'Huérfana', parentId: 'no-existe' },
];

describe('categoryTree', () => {
  it('expands a parent to all its levels', () => {
    expect(withDescendants(['salud'], cats).sort()).toEqual(['nutri', 'odonto', 'orto', 'salud']);
  });

  it('keeps leaves and dedupes overlapping picks', () => {
    expect(withDescendants(['orto'], cats)).toEqual(['orto']);
    expect(withDescendants(['odonto', 'orto'], cats).sort()).toEqual(['odonto', 'orto']);
  });

  it('treats a category with an unknown parent as a root', () => {
    const tree = buildCategoryTree(cats);
    expect(tree.childrenOf(null).map((c) => c.id)).toEqual(['salud', 'comida', 'huerfana']);
  });

  it('lists ancestors from the root down', () => {
    expect(
      buildCategoryTree(cats)
        .ancestorsOf('orto')
        .map((c) => c.id),
    ).toEqual(['salud', 'odonto']);
  });

  it('survives a cycle in the data', () => {
    const loop = [
      { id: 'a', name: 'A', parentId: 'b' },
      { id: 'b', name: 'B', parentId: 'a' },
    ];
    const tree = buildCategoryTree(loop);
    expect(tree.descendantsOf('a')).toEqual(['b']);
    expect(tree.ancestorsOf('a').map((c) => c.id)).toEqual(['b']);
  });

  it('searches without accents or case', () => {
    expect(normalizeForSearch('  NUTRICIÓN ')).toBe('nutricion');
  });
});
