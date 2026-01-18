import { memo, ReactNode } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useThemedColors } from '@/hooks';
import { FormActions } from '../FormActions';
import { BackButton } from '@/components/ui';
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
                    <BackButton />
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
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                        submitLabel={submitLabel}
                        hasChanges={hasChanges}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
});
