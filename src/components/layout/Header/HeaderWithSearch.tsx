import { memo } from 'react';
import { BaseHeader } from './BaseHeader';

/**
 * @example
 * // En tu _layout.tsx principal:
 * import { HeaderWithSearch } from '@/components/layout/Header/HeaderWithSearch';
 *
 * <HeaderWithSearch />
 */
export const HeaderWithSearch = memo(function HeaderWithSearch() {
  return <BaseHeader showBorder={true} />;
});
