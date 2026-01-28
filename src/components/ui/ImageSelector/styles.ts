import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    scrollContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 12,
        width: 96,
        height: 64,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border.medium,
        backgroundColor: colors.background.secondary,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    orderBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
    },
    orderText: {
        color: colors.text.inverse,
        fontWeight: 'bold',
        fontSize: 12,
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    primaryBadge: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
    },
    primaryText: {
        color: colors.text.inverse,
        fontWeight: 'bold',
        fontSize: 12,
    },
    addButton: {
        width: 96,
        height: 64,
        borderRadius: 10,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addText: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    helperText: {
        fontSize: 13,
        marginTop: 6,
    },
});
