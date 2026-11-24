/**
 * Árbol de categorías (hasta 3 niveles hoy, ~200 categorías) armado una vez a partir de la lista
 * plana {id, name, parentId}. Una categoría cuyo padre no está en la lista se trata como raíz.
 */

export interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null;
}

export function buildCategoryTree<T extends CategoryNode>(categories: T[]) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const children = new Map<string | null, T[]>();
  for (const c of categories) {
    const key = c.parentId && byId.has(c.parentId) ? c.parentId : null;
    const list = children.get(key);
    if (list) list.push(c);
    else children.set(key, [c]);
  }

  const childrenOf = (id: string | null): T[] => children.get(id) ?? [];

  const descendantsOf = (id: string): string[] => {
    const out: string[] = [];
    const seen = new Set([id]);
    const stack = [...childrenOf(id)];
    while (stack.length) {
      const c = stack.pop()!;
      if (seen.has(c.id)) continue; // datos con ciclo: no colgarse
      seen.add(c.id);
      out.push(c.id);
      stack.push(...childrenOf(c.id));
    }
    return out;
  };

  /** Ancestros de la raíz hacia abajo, sin incluir la categoría */
  const ancestorsOf = (id: string): T[] => {
    const out: T[] = [];
    const seen = new Set([id]);
    let parent = byId.get(id)?.parentId;
    while (parent && byId.has(parent) && !seen.has(parent)) {
      seen.add(parent);
      out.unshift(byId.get(parent)!);
      parent = byId.get(parent)!.parentId;
    }
    return out;
  };

  return { byId, childrenOf, descendantsOf, ancestorsOf };
}

/**
 * Para filtrar: elegir una categoría incluye todas sus subcategorías (la consulta compara ids
 * exactos, así que "Salud" sola no traería los comercios de "Odontología").
 */
export function withDescendants(ids: string[], categories: CategoryNode[]): string[] {
  if (ids.length === 0 || categories.length === 0) return ids;
  const tree = buildCategoryTree(categories);
  return [...new Set(ids.flatMap((id) => [id, ...tree.descendantsOf(id)]))];
}

/** Compara sin tildes ni mayúsculas: "nutricion" encuentra "Nutrición" */
export function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
