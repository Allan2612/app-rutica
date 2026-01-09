import { StyleSheet } from 'react-native';
import { colors } from '@/styles/theme/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    content: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '32%',
        marginBottom: 18,
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 13,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    placeholderTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: 6,
    },
    placeholderSubtitle: {
        fontSize: 13,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 18,
    },
});
