/**
 * Utility to split items into location-matching and non-matching groups.
 * Used across public listing screens and home featured sections
 * to show "En [location]" and "Otros lugares" instead of hiding non-matching items.
 */

interface WithLocationLabel {
    locationLabel: string | null;
}

export interface LocationFilter {
    province?: string | null;
    canton?: string | null;
    district?: string | null;
}

export interface SplitResult<T> {
    local: T[];
    others: T[];
    hasLocation: boolean;
    locationName: string;
}

/**
 * Splits an array of items into two groups based on location matching.
 * When no location filter is active, all items go into `local` and `others` is empty.
 */
export function splitItemsByLocation<T extends WithLocationLabel>(
    items: T[],
    location: LocationFilter | null | undefined
): SplitResult<T> {
    const locationName = getLocationDisplayName(location ?? null);
    const hasLocation = Boolean(location && (location.province || location.canton || location.district));

    if (!hasLocation) {
        return { local: items, others: [], hasLocation: false, locationName: '' };
    }

    const local: T[] = [];
    const others: T[] = [];

    for (const item of items) {
        const parts = item.locationLabel?.split(', ').map(p => p.toLowerCase()) || [];
        let matches = false;

        if (location!.district) {
            matches = parts.some(part => part === location!.district!.toLowerCase());
        } else if (location!.canton) {
            matches = parts.some(part => part === location!.canton!.toLowerCase());
        } else if (location!.province) {
            matches = parts.some(part => part === location!.province!.toLowerCase());
        }

        if (matches) {
            local.push(item);
        } else {
            others.push(item);
        }
    }

    return { local, others, hasLocation: true, locationName };
}

/**
 * Gets the most specific location name for display purposes.
 */
export function getLocationDisplayName(location: LocationFilter | null): string {
    if (!location) return '';
    if (location.district) return location.district;
    if (location.canton) return location.canton;
    if (location.province) return location.province;
    return '';
}

/**
 * Returns a shortened version of the locationLabel for card display.
 * Full label format: "Province, Canton, District"
 * Shortened: "Canton, District" (last 2 parts).
 * If label has ≤2 parts, returns as-is.
 */
export function getShortLocationLabel(label: string | null | undefined): string | null {
    if (!label) return null;
    const parts = label.split(', ');
    if (parts.length <= 2) return label;
    return parts.slice(-2).join(', ');
}
