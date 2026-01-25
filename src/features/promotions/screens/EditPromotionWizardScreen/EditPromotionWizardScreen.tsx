import { memo, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from '../CreatePromotionWizardScreen/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, AlertCircle } from 'lucide-react-native';
import { useThemedColors, useFormExitGuard } from '@/hooks';
import {
  useCreatePromotionWizard,
  useUpdatePromotion,
  usePromotionById,
} from '@/features/promotions/hooks';
import { ConfirmExitDialog } from '@/components/manage';
import {
  WizardProgressBar,
  WizardNavigation,
  WizardStepBusiness,
  WizardStepInfo,
  WizardStepDiscount,
  WizardStepDates,
  WizardStepImage,
  WizardStepPayment,
} from '@/components/promotions';
import type { UpdatePromotionData } from '@/types/entities';

interface EditPromotionWizardScreenProps {
  promotionId: string;
}

export const EditPromotionWizardScreen = memo(function EditPromotionWizardScreen({
  promotionId,
}: EditPromotionWizardScreenProps) {
  const colors = useThemedColors();

  // Fetch promotion data
  const { data: promotionData, isLoading, error } = usePromotionById(promotionId);

  const wizard = useCreatePromotionWizard();
  const updateMutation = useUpdatePromotion();

  // Initialize form with promotion data
  useEffect(() => {
    if (promotionData) {
      wizard.updateField('businessId', promotionData.businessId);
      wizard.updateField('title', promotionData.title);
      wizard.updateField('description', promotionData.description || '');
      wizard.updateField('scope', promotionData.scope);
      wizard.updateField('discountType', promotionData.discountType);
      wizard.updateField('discountValue', promotionData.discountValue);
      wizard.updateField('startDate', new Date(promotionData.startAt));
      wizard.updateField('endDate', new Date(promotionData.endAt));
      wizard.updateField('selectedCategoryIds', promotionData.categoryIds);
      wizard.updateField('selectedProductIds', promotionData.productIds);
      wizard.updateField('coverUri', promotionData.coverUrl);
      wizard.updateField('paymentReference', promotionData.paymentReference || '');
    }
  }, [promotionData]);

  // Detectar si hay cambios en el formulario
  const hasChanges = useMemo(() => {
    if (!promotionData) return false;
    
    return (
      wizard.formData.title !== promotionData.title ||
      wizard.formData.description !== promotionData.description ||
      wizard.formData.discountValue !== promotionData.discountValue ||
      wizard.formData.coverUri !== promotionData.coverUrl ||
      JSON.stringify(wizard.formData.selectedCategoryIds) !== JSON.stringify(promotionData.categoryIds) ||
      JSON.stringify(wizard.formData.selectedProductIds) !== JSON.stringify(promotionData.productIds)
    );
  }, [wizard.formData, promotionData]);

  // Hook para manejar la confirmación de salida
  const {
    showExitDialog,
    handleSafeBack,
    confirmExit,
    cancelExit,
  } = useFormExitGuard({
    hasChanges,
    onExit: () => {
      router.back();
    },
  });

  // Convert wizard data to UpdatePromotionData
  const buildUpdateData = useCallback((): UpdatePromotionData => {
    return {
      title: wizard.formData.title,
      description: wizard.formData.description,
      scope: wizard.formData.scope,
      discountType: wizard.formData.discountType,
      discountValue: wizard.formData.discountValue,
      startAt: wizard.formData.startDate.toISOString(),
      endAt: wizard.formData.endDate.toISOString(),
      categoryIds: wizard.formData.selectedCategoryIds,
      productIds: wizard.formData.selectedProductIds,
      coverUri: wizard.formData.coverUri,
      paymentReference: wizard.formData.paymentReference,
    };
  }, [wizard.formData]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!wizard.validateAll()) {
      Toast.show({
        type: 'error',
        text1: 'Datos incompletos',
        text2: 'Por favor revisa que todos los campos obligatorios estén completos.',
      });
      return;
    }

    const data = buildUpdateData();

    updateMutation.mutate(
      { promotionId, data },
      {
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Promoción Actualizada',
            text2: 'Los cambios han sido guardados correctamente.',
          });

          setTimeout(() => {
            router.replace('/(app)/(tabs)/manage/promotions');
          }, 1500);
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: 'Error al actualizar',
            text2: error.message || 'No se pudo actualizar la promoción.',
          });
        },
      }
    );
  }, [wizard, buildUpdateData, updateMutation, promotionId]);

  // Render current step
  const renderStep = useMemo(() => {
    switch (wizard.currentStep.id) {
      case 'business':
        return (
          <WizardStepBusiness
            formData={wizard.formData}
            errors={wizard.errors}
            onBusinessChange={wizard.handleBusinessChange}
          />
        );
      case 'info':
        return (
          <WizardStepInfo
            formData={wizard.formData}
            errors={wizard.errors}
            onFieldChange={wizard.updateField}
          />
        );
      case 'discount':
        return (
          <WizardStepDiscount
            formData={wizard.formData}
            errors={wizard.errors}
            onFieldChange={wizard.updateField}
            onToggleProduct={wizard.toggleProductSelection}
          />
        );
      case 'dates':
        return (
          <WizardStepDates
            formData={wizard.formData}
            errors={wizard.errors}
            onFieldChange={wizard.updateField}
            onToggleCategory={wizard.toggleCategorySelection}
          />
        );
      case 'image':
        return (
          <WizardStepImage
            formData={wizard.formData}
            errors={wizard.errors}
            onFieldChange={wizard.updateField}
          />
        );
      case 'payment':
        return (
          <WizardStepPayment
            formData={wizard.formData}
            errors={wizard.errors}
            onFieldChange={wizard.updateField}
          />
        );
      default:
        return null;
    }
  }, [wizard]);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background.secondary }]}
        edges={['top']}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={{ color: colors.text.secondary, marginTop: 16 }}>
            Cargando promoción...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background.secondary }]}
        edges={['top']}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <AlertCircle size={48} color={colors.error} />
          <Text style={{ color: colors.text.primary, marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>
            Error al cargar
          </Text>
          <Text style={{ color: colors.text.secondary, marginTop: 8, textAlign: 'center' }}>
            {error.message || 'No se pudo cargar la promoción'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background.secondary }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
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
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              Editar Promoción
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Modifica los datos de tu promoción
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarWrapper}>
          <WizardProgressBar
            currentStepIndex={wizard.currentStepIndex}
            progress={wizard.progress}
          />
        </View>

        {/* Step Title */}
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepTitle, { color: colors.text.primary }]}>
            {wizard.currentStep.title}
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.text.secondary }]}>
            {wizard.currentStep.description}
          </Text>
        </View>

        {/* Card with Step Content */}
        <View style={styles.cardWrapper}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.background.primary,
                borderColor: colors.border.medium,
              },
            ]}
          >
            <View style={styles.stepContent}>{renderStep}</View>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationWrapper}>
          <WizardNavigation
            isFirstStep={wizard.isFirstStep}
            isLastStep={wizard.isLastStep}
            onPrevious={wizard.goToPreviousStep}
            onNext={wizard.goToNextStep}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
            isCurrentStepValid={wizard.isCurrentStepValid}
            submitLabel="Guardar Cambios"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Modal de confirmación de salida */}
      <ConfirmExitDialog
        visible={showExitDialog}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="¿Salir sin guardar?"
        description="Los cambios realizados se perderán si no los guardas."
        cancelLabel="Continuar"
        confirmLabel="Salir"
      />
    </SafeAreaView>
  );
});
