import { memo } from 'react';
import { useIsDesktopWeb } from '@/hooks';
import { BaseHeader } from './BaseHeader';

/**
 * @example
 * // En tu _layout.tsx principal:
 * import { HeaderWithSearch } from '@/components/layout/Header/HeaderWithSearch';
 *
 * <HeaderWithSearch />
 */
export const HeaderWithSearch = memo(function HeaderWithSearch() {
  // En PC la cuenta está en el panel lateral
  return <BaseHeader showBorder={true} hideUserButton={useIsDesktopWeb()} />;
});
