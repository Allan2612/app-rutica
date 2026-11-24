import { useMemo } from 'react';
import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';
import { PAGE_SIZE, type Page } from '@/services/listQuery';

/**
 * useInfiniteQuery con páginas de PAGE_SIZE y `data` como lista plana.
 * `fetchPage` recibe el número de página y devuelve filas + total.
 * `map` debe ser estable (función de módulo) para no rehacer la lista en cada render.
 */
export function usePagedList<TRow, TItem = TRow>(
  queryKey: QueryKey,
  fetchPage: (page: number) => Promise<Page<TRow>>,
  options: { enabled?: boolean; staleTime?: number; map?: (row: TRow) => TItem } = {},
) {
  const { enabled = true, staleTime, map } = options;
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last: Page<TRow>, all: Page<TRow>[]) =>
      all.length * PAGE_SIZE < last.total ? all.length : undefined,
    enabled,
    staleTime,
  });

  const data = useMemo(() => {
    const rows = query.data?.pages.flatMap((p) => p.rows) ?? [];
    return (map ? rows.map(map) : rows) as TItem[];
  }, [query.data, map]);

  return {
    data,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    // cancelRefetch: false → si ya se está pidiendo una página, no la cancela ni la repite
    fetchNextPage: () => query.fetchNextPage({ cancelRefetch: false }),
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
