import { StyleSheet } from 'react-native';
import { spacing } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.sm, // 48 + 8 = 56px (logo sobresale 60px, se superpone ligeramente pero sin bloquear eventos)
    },
    mainContent: {
        maxWidth: 800,
        width: '100%',
        alignSelf: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
