import { useState, useCallback, useMemo } from 'react';
import {
  PromotionWizardFormData,
  PromotionWizardErrors,
  WizardStepId,
  WIZARD_STEPS,
} from '@/types/entities';
import type { PromoScope, DiscountType } from '@/types/enums';

// ---------- Initial State ----------
const createInitialFormData = (): PromotionWizardFormData => ({
  // Step 1 - Business
  businessId: '',
  title: '',
  description: '',
  scope: 'general' as PromoScope,

  // Step 2 - Discount
  discountType: 'percentage' as DiscountType,
  discountValue: 0,
  selectedProductIds: [],

  // Step 3 - Dates & Categories
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  selectedCategoryIds: [],

  // Step 4 - Image
  coverUri: null,

  // Step 5 - Payment
  paymentReference: '',
});

const createInitialErrors = (): PromotionWizardErrors => ({
  businessId: undefined,
  title: undefined,
  description: undefined,
  scope: undefined,
  discountType: undefined,
  discountValue: undefined,
  selectedProductIds: undefined,
  startDate: undefined,
  endDate: undefined,
  selectedCategoryIds: undefined,
  coverUri: undefined,
  paymentReference: undefined,
});

// ---------- Validation Functions ----------
const validateBusinessStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (!formData.businessId) {
    errors.businessId = 'Debe seleccionar un negocio';
  }

  return errors;
};

const validateInfoStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres';
  }

  return errors;
};

const validateDiscountStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (formData.discountValue <= 0) {
    errors.discountValue = 'El valor del descuento debe ser mayor a 0';
  }

  if (formData.discountType === 'percentage' && formData.discountValue > 100) {
    errors.discountValue = 'El porcentaje no puede ser mayor a 100%';
  }

  if (
    formData.scope === 'product' &&
    formData.selectedProductIds.length === 0
  ) {
    errors.selectedProductIds = 'Debe seleccionar al menos un producto';
  }

  return errors;
};

const validateDatesStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (!formData.startDate) {
    errors.startDate = 'Debe seleccionar una fecha de inicio';
  }

  if (!formData.endDate) {
    errors.endDate = 'Debe seleccionar una fecha de fin';
  }

  if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
    errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
  }

  if (formData.selectedCategoryIds.length === 0) {
    errors.selectedCategoryIds = 'Debe seleccionar al menos una categoría';
  }

  return errors;
};

const validateImageStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (!formData.coverUri) {
    errors.coverUri = 'Debe seleccionar una imagen de portada';
  }

  return errors;
};

const validatePaymentStep = (formData: PromotionWizardFormData): PromotionWizardErrors => {
  const errors: PromotionWizardErrors = {};

  if (!formData.paymentReference || formData.paymentReference.trim().length < 4) {
    errors.paymentReference = 'Debe ingresar el número de referencia SINPE';
  }

  return errors;
};

const validateStep = (
  stepId: WizardStepId,
  formData: PromotionWizardFormData
): PromotionWizardErrors => {
  switch (stepId) {
    case 'business':
      return validateBusinessStep(formData);
    case 'info':
      return validateInfoStep(formData);
    case 'discount':
      return validateDiscountStep(formData);
    case 'dates':
      return validateDatesStep(formData);
    case 'image':
      return validateImageStep(formData);
    case 'payment':
      return validatePaymentStep(formData);
    default:
      return {};
  }
};

// ---------- Hook ----------
export function useCreatePromotionWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<PromotionWizardFormData>(createInitialFormData);
  const [errors, setErrors] = useState<PromotionWizardErrors>(createInitialErrors);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Current step info
  const currentStep = WIZARD_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === WIZARD_STEPS.length - 1;
  const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

  // Check if current step has errors
  const currentStepErrors = useMemo(() => {
    return validateStep(currentStep.id, formData);
  }, [currentStep.id, formData]);

  const isCurrentStepValid = useMemo(() => {
    return Object.keys(currentStepErrors).length === 0;
  }, [currentStepErrors]);

  // Update form field
  const updateField = useCallback(
    <K extends keyof PromotionWizardFormData>(
      field: K,
      value: PromotionWizardFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when updating
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  // Update multiple fields at once
  const updateFields = useCallback(
    (updates: Partial<PromotionWizardFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
      // Clear errors for updated fields
      const clearedErrors: Partial<PromotionWizardErrors> = {};
      Object.keys(updates).forEach((key) => {
        clearedErrors[key as keyof PromotionWizardErrors] = undefined;
      });
      setErrors((prev) => ({ ...prev, ...clearedErrors }));
    },
    []
  );

  // Go to next step
  const goToNextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep.id, formData);

    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return false;
    }

    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      return true;
    }

    return false;
  }, [currentStep.id, formData, isLastStep]);

  // Go to previous step
  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      return true;
    }
    return false;
  }, [isFirstStep]);

  // Go to specific step (only if all previous steps are valid)
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= WIZARD_STEPS.length) {
        return false;
      }

      // Can always go back
      if (stepIndex < currentStepIndex) {
        setCurrentStepIndex(stepIndex);
        return true;
      }

      // Validate all steps up to target
      for (let i = currentStepIndex; i < stepIndex; i++) {
        const stepErrors = validateStep(WIZARD_STEPS[i].id, formData);
        if (Object.keys(stepErrors).length > 0) {
          setErrors((prev) => ({ ...prev, ...stepErrors }));
          setCurrentStepIndex(i);
          return false;
        }
      }

      setCurrentStepIndex(stepIndex);
      return true;
    },
    [currentStepIndex, formData]
  );

  // Validate all steps
  const validateAll = useCallback((): boolean => {
    setHasAttemptedSubmit(true);
    let allErrors: PromotionWizardErrors = {};

    for (const step of WIZARD_STEPS) {
      const stepErrors = validateStep(step.id, formData);
      allErrors = { ...allErrors, ...stepErrors };
    }

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [formData]);

  // Reset wizard
  const resetWizard = useCallback(() => {
    setCurrentStepIndex(0);
    setFormData(createInitialFormData());
    setErrors(createInitialErrors());
    setHasAttemptedSubmit(false);
  }, []);

  // Handle business change - reset related fields
  const handleBusinessChange = useCallback((businessId: string) => {
    setFormData((prev) => ({
      ...prev,
      businessId,
      selectedProductIds: [], // Reset products when business changes
    }));
    setErrors((prev) => ({
      ...prev,
      businessId: undefined,
      selectedProductIds: undefined,
    }));
  }, []);

  // Toggle product selection
  const toggleProductSelection = useCallback((productId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedProductIds.includes(productId);
      return {
        ...prev,
        selectedProductIds: isSelected
          ? prev.selectedProductIds.filter((id) => id !== productId)
          : [...prev.selectedProductIds, productId],
      };
    });
    setErrors((prev) => ({ ...prev, selectedProductIds: undefined }));
  }, []);

  // Toggle category selection
  const toggleCategorySelection = useCallback((categoryId: string) => {
    setFormData((prev) => {
      const isSelected = prev.selectedCategoryIds.includes(categoryId);
      return {
        ...prev,
        selectedCategoryIds: isSelected
          ? prev.selectedCategoryIds.filter((id) => id !== categoryId)
          : [...prev.selectedCategoryIds, categoryId],
      };
    });
    setErrors((prev) => ({ ...prev, selectedCategoryIds: undefined }));
  }, []);

  return {
    // State
    formData,
    errors,
    currentStepIndex,
    currentStep,
    hasAttemptedSubmit,

    // Computed
    isFirstStep,
    isLastStep,
    progress,
    isCurrentStepValid,
    steps: WIZARD_STEPS,

    // Actions
    updateField,
    updateFields,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateAll,
    resetWizard,

    // Helpers
    handleBusinessChange,
    toggleProductSelection,
    toggleCategorySelection,
  };
}
