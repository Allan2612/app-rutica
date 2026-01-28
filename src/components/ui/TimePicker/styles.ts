import { StyleSheet } from 'react-native';
import { typography } from '@/styles/theme';

export const ITEM_HEIGHT = 44;
export const VISIBLE_ITEMS = 5;

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    wheelColumn: {
        width: 70,
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        overflow: 'hidden',
    },
    selectionIndicator: {
        position: 'absolute',
        top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        borderRadius: 8,
        zIndex: 0,
    },
    wheelItem: {
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheelItemText: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.fontWeights.normal,
    },
    selectedItemText: {
        fontWeight: typography.fontWeights.bold,
    },
    separator: {
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.fontWeights.bold,
        marginHorizontal: 8,
    },
});
