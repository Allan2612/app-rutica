import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    stepWrapper: {
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleActive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '700',
    },
    stepLabel: {
        fontSize: 11,
        fontWeight: '600',
    },
    stepLine: {
        height: 2,
        width: 40,
        marginHorizontal: 6,
        marginTop: 17,
    },
});
