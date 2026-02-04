import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    stepIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    stepWrapper: {
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        fontSize: 16,
        fontWeight: '700',
    },
    stepLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    stepLine: {
        height: 2,
        width: 60,
        marginHorizontal: 8,
    },
});
