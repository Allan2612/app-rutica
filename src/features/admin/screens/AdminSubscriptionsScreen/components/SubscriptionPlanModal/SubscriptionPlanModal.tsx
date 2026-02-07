import { memo, useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, Switch } from 'react-native';
import { X, Crown, Save } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { useCreateSubscriptionPlan, useUpdateSubscriptionPlan } from '../../../../hooks/useAdminSubscriptions';
import type { Subscription } from '@/types/entities';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

interface SubscriptionPlanModalProps {
    visible: boolean;
    plan: Subscription | null;
    onClose: () => void;
}

export const SubscriptionPlanModal = memo(function SubscriptionPlanModal({
    visible,
    plan,
    onClose,
}: SubscriptionPlanModalProps) {
    const colors = useThemedColors();
    const createMutation = useCreateSubscriptionPlan();
    const updateMutation = useUpdateSubscriptionPlan();

    const isEditing = plan !== null;

    // Form state
    const [formData, setFormData] = useState({
        name_sub: '',
        description_sub: '',
        price_sub: 0,
        features_sub: [] as string[],
        is_recurring_sub: false,
        is_active_sub: true,
        display_order_sub: 1,
    });
    const [featuresText, setFeaturesText] = useState('');

    useEffect(() => {
        if (plan) {
            setFormData({
                name_sub: plan.name_sub,
                description_sub: plan.description_sub,
                price_sub: plan.price_sub,
                features_sub: plan.features_sub || [],
                is_recurring_sub: plan.is_recurring_sub,
                is_active_sub: plan.is_active_sub,
                display_order_sub: plan.display_order_sub,
            });
            setFeaturesText((plan.features_sub || []).join('\n'));
        } else {
            setFormData({
                name_sub: '',
                description_sub: '',
                price_sub: 0,
                features_sub: [],
                is_recurring_sub: false,
                is_active_sub: true,
                display_order_sub: 1,
            });
            setFeaturesText('');
        }
    }, [plan, visible]);

    const handleSave = async () => {
        // Parse features from text
        const features = featuresText
            .split('\n')
            .map(f => f.trim())
            .filter(f => f.length > 0);

        // Generate type_sub from name (snake_case + unique suffix)
        const generateTypeFromName = (name: string): string => {
            const base = name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/[^a-z0-9\s]/g, '') // Remove special chars
                .trim()
                .replace(/\s+/g, '_'); // Replace spaces with underscore
            const timestamp = Date.now().toString(36);
            return `${base}_${timestamp}`;
        };

        const dataToSave = {
            ...formData,
            features_sub: features,
            // Only generate type for new plans
            ...(!isEditing && { type_sub: generateTypeFromName(formData.name_sub) }),
        };

        try {
            if (isEditing && plan) {
                // For updates, exclude type_sub
                const { ...updateData } = dataToSave;
                delete (updateData as any).type_sub;
                await updateMutation.mutateAsync({
                    planId: plan.id_sub,
                    updates: updateData as any,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Plan actualizado',
                    text2: `"${formData.name_sub}" ha sido actualizado correctamente.`,
                });
            } else {
                await createMutation.mutateAsync(dataToSave as any);
                Toast.show({
                    type: 'success',
                    text1: 'Plan creado',
                    text2: `"${formData.name_sub}" está disponible para los usuarios.`,
                });
            }
            onClose();
        } catch (error: any) {
            const errorMessage = error?.message?.includes('duplicate') || error?.message?.includes('unique')
                ? 'Ya existe un plan con este nombre. Usa un nombre diferente.'
                : 'No se pudo guardar el plan. Verifica los datos e intenta de nuevo.';
            Toast.show({
                type: 'error',
                text1: 'Error al guardar',
                text2: errorMessage,
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;
    const isFormValid = formData.name_sub.trim() && formData.price_sub > 0;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modal, { backgroundColor: colors.background.primary }]}>
                    {/* Header */}
                    <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
                        <View style={styles.headerLeft}>
                            <Crown size={24} color="#eab308" />
                            <View>
                                <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                                    {isEditing ? 'Editar Plan' : 'Nuevo Plan'}
                                </Text>
                                {plan && (
                                    <Text style={[styles.headerSubtitle, { color: colors.text.tertiary }]}>
                                        {plan.type_sub}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text.tertiary} />
                        </Pressable>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Name */}
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Nombre del plan *
                            </Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.border.medium, color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                placeholder="Ej: Galería Empresa"
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.name_sub}
                                onChangeText={(text) => setFormData({ ...formData, name_sub: text })}
                            />
                        </View>

                        {/* Description */}
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Descripción
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { borderColor: colors.border.medium, color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                placeholder="Describe los beneficios del plan..."
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.description_sub}
                                onChangeText={(text) => setFormData({ ...formData, description_sub: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Price */}
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Precio (₡) *
                            </Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.border.medium, color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                placeholder="0"
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.price_sub.toString()}
                                onChangeText={(text) => setFormData({ ...formData, price_sub: parseInt(text) || 0 })}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Features */}
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Características (una por línea)
                            </Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { borderColor: colors.border.medium, color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                placeholder="Hasta 10 fotos por empresa&#10;Dashboard con estadísticas&#10;Soporte prioritario"
                                placeholderTextColor={colors.text.tertiary}
                                value={featuresText}
                                onChangeText={setFeaturesText}
                                multiline
                                numberOfLines={5}
                            />
                        </View>

                        {/* Display Order */}
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.text.secondary }]}>
                                Orden de visualización
                            </Text>
                            <TextInput
                                style={[styles.input, { borderColor: colors.border.medium, color: colors.text.primary, backgroundColor: colors.background.secondary }]}
                                placeholder="1"
                                placeholderTextColor={colors.text.tertiary}
                                value={formData.display_order_sub.toString()}
                                onChangeText={(text) => setFormData({ ...formData, display_order_sub: parseInt(text) || 1 })}
                                keyboardType="numeric"
                            />
                        </View>

                        {/* Toggles */}
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleItem}>
                                <Text style={[styles.toggleLabel, { color: colors.text.secondary }]}>
                                    Pago recurrente (mensual)
                                </Text>
                                <Switch
                                    value={formData.is_recurring_sub}
                                    onValueChange={(value) => setFormData({ ...formData, is_recurring_sub: value })}
                                    trackColor={{ false: colors.border.medium, true: colors.primary[500] }}
                                />
                            </View>
                            <View style={styles.toggleItem}>
                                <Text style={[styles.toggleLabel, { color: colors.text.secondary }]}>
                                    Plan activo
                                </Text>
                                <Switch
                                    value={formData.is_active_sub}
                                    onValueChange={(value) => setFormData({ ...formData, is_active_sub: value })}
                                    trackColor={{ false: colors.border.medium, true: '#10b981' }}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
                        <Pressable
                            style={[styles.button, styles.cancelButton, { borderColor: colors.border.medium }]}
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.button,
                                styles.saveButton,
                                { backgroundColor: isFormValid ? colors.primary[500] : colors.border.medium },
                            ]}
                            onPress={handleSave}
                            disabled={isLoading || !isFormValid}
                        >
                            <Save size={18} color="#fff" />
                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Plan'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
});
