import { memo, ReactNode } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useThemedColors, useFormExitGuard } from '@/hooks';
import { FormActions } from '../FormActions';
import { ConfirmExitDialog } from '../ConfirmExitDialog';
import { formViewStyles as styles } from '@/styles/form-view-styles';

interface GenericFormViewProps {
    title: string;
    subtitle: string;
    isSubmitting: boolean;
    hasChanges: boolean;
    submitLabel: string;
    onCancel: () => void;
    onSubmit: () => void;
    children: ReactNode;
}

export const GenericFormView = memo(function GenericFormView({
    title,
    subtitle,
    isSubmitting,
    hasChanges,
    submitLabel,
    onCancel,
    onSubmit,
    children,
}: GenericFormViewProps) {
    const colors = useThemedColors();
    
    // Hook para manejar la confirmación de salida
    const {
        showExitDialog,
        handleSafeBack,
        confirmExit,
        cancelExit,
    } = useFormExitGuard({
        hasChanges,
        onExit: onCancel,
    });

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background.secondary }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                    {/* BackButton personalizado que usa el guard */}
                    <Pressable
                        onPress={handleSafeBack}
                        style={({ pressed }) => [
                            styles.backButton,
                            { 
                                backgroundColor: pressed 
                                    ? colors.primary[500] 
                                    : colors.background.tertiary,
                            },
                        ]}
                        hitSlop={8}
                        disabled={isSubmitting}
                    >
                        {({ pressed }) => (
                            <ChevronLeft
                                size={24}
                                color={pressed ? '#FFFFFF' : colors.text.primary}
                                strokeWidth={2.5}
                            />
                        )}
                    </Pressable>
                    <View style={styles.headerContent}>
                        <Text style={[styles.title, { color: colors.text.primary }]}>
                            {title}
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                            {subtitle}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.formCard,
                        {
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.light,
                        },
                    ]}
                >
                    {children}

                    <FormActions
                        onCancel={handleSafeBack}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel={submitLabel}
                        hasChanges={false}
                    />
                </View>
            </ScrollView>

            {/* Modal de confirmación de salida */}
            <ConfirmExitDialog
                visible={showExitDialog}
                onConfirm={confirmExit}
                onCancel={cancelExit}
            />
        </KeyboardAvoidingView>
    );
});
