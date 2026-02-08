import { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useThemedColors, useFormExitGuard, usePromotionQuota } from '@/hooks';
import { useCreatePromotionWizard, useCreatePromotion } from '@/features/promotions/hooks';
import { ConfirmExitDialog } from '@/components/manage';
import {
  WizardProgressBar,
  WizardNavigation,
  WizardStepBusiness,
  WizardStepInfo,
  WizardStepDiscount,
  WizardStepDates,
  WizardStepImage,
} from '@/components/promotions';
import type { PromotionFormData } from '@/types/entities';

export const CreatePromotionWizardScreen = memo(function CreatePromotionWizardScreen() {
  const colors = useThemedColors();

  const wizard = useCreatePromotionWizard();
  const createMutation = useCreatePromotion();

  // Obtener cuota de promociones para el negocio seleccionado
  const { quotaInfo: promotionQuota } = usePromotionQuota(
    wizard.formData.businessId || '',
    !!wizard.formData.businessId
  );

  // Verificar si puede avanzar desde el paso de negocio
  const canProceedFromBusinessStep = useMemo(() => {
    if (wizard.currentStep.id !== 'business') return true;
    if (!wizard.formData.businessId) return false;
    // Si tiene negocio seleccionado, verificar cuota
    return promotionQuota?.canAdd ?? true;
  }, [wizard.currentStep.id, wizard.formData.businessId, promotionQuota]);

  // Detectar si hay cambios en el formulario
  const hasChanges = useMemo(() => {
    return !!(
      wizard.formData.businessId ||
      wizard.formData.title ||
      wizard.formData.description ||
      wizard.formData.coverUri ||
      wizard.formData.selectedCategoryIds.length > 0 ||
      wizard.formData.selectedProductIds.length > 0 ||
      wizard.currentStepIndex > 0
    );
  }, [wizard.formData, wizard.currentStepIndex]);

  // Hook para manejar la confirmación de salida
  const {
    showExitDialog,
    handleSafeBack,
    confirmExit,
    cancelExit,
  } = useFormExitGuard({
    hasChanges,
    onExit: () => {
      wizard.resetWizard();
      router.back();
    },
  });

  // Convert wizard data to PromotionFormData
  const buildCreateData = useCallback((): PromotionFormData => {
    return {
      businessId: wizard.formData.businessId,
      title: wizard.formData.title,
      description: wizard.formData.description,
      scope: wizard.formData.scope,
      discountType: wizard.formData.discountType,
      discountValue: wizard.formData.discountValue,
      startAt: wizard.formData.startDate.toISOString(),
      endAt: wizard.formData.endDate.toISOString(),
      categoryIds: wizard.formData.selectedCategoryIds,
      productIds: wizard.formData.selectedProductIds,
      scopeCategoryIds: wizard.formData.scopeCategoryIds,
      comboItems: wizard.formData.comboItems,
      coverUri: wizard.formData.coverUri,
      isActive: wizard.formData.isActive,
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

    const data = buildCreateData();

    createMutation.mutate(data, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Promoción Enviada',
          text2: 'Tu promoción ha sido enviada para revisión.',
        });

        setTimeout(() => {
          router.replace('/(app)/(tabs)/manage/promotions');
        }, 1500);
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error al crear promoción',
          text2: error.message || 'No se pudo crear la promoción. Verifica los permisos.',
        });
      },
    });
  }, [wizard, buildCreateData, createMutation]);

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
            onToggleScopeCategory={wizard.toggleScopeCategorySelection}
            onUpdateComboItem={wizard.updateComboItem}
            onToggleComboItem={wizard.toggleComboItem}
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
      default:
        return null;
    }
  }, [wizard]);

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
              Nueva Promoción
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Crea una promoción para destacar tu negocio
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
            <ScrollView
              style={styles.stepScrollView}
              contentContainerStyle={styles.stepContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {renderStep}
            </ScrollView>
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
            isSubmitting={createMutation.isPending}
            isCurrentStepValid={wizard.isCurrentStepValid && canProceedFromBusinessStep}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Modal de confirmación de salida */}
      <ConfirmExitDialog
        visible={showExitDialog}
        onConfirm={confirmExit}
        onCancel={cancelExit}
        title="¿Salir del asistente?"
        description="Se perderá todo el progreso de la promoción. Los datos ingresados no se guardarán."
        cancelLabel="Continuar"
        confirmLabel="Salir"
      />
    </SafeAreaView>
  );
});
