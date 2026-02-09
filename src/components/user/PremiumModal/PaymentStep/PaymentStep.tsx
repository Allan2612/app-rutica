import { memo } from 'react';
import { View } from 'react-native';
import type { SubscriptionType } from '@/types/enums';
import type { BusinessSelections, EntitySelections } from '../usePremiumModal';
import { PlansSummary } from '../PlansSummary';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { PaymentInfo } from '../PaymentInfo';
import { PaymentForm } from '../PaymentForm';
import { styles } from './styles';

interface PaymentStepProps {
  selectedPlans: SubscriptionType[];
  businessSelections: BusinessSelections;
  entitySelections: EntitySelections;
  preSelectedBusinessName?: string;
  preSelectedEntityName?: string;
  paymentMethod: 'sinpe' | 'transfer';
  paymentReference: string;
  paymentNote: string;
  error: string | null;
  sinpeNumber: string;
  sinpeName: string;
  ibanAccount: string;
  transferName: string;
  onMethodChange: (method: 'sinpe' | 'transfer') => void;
  onReferenceChange: (value: string) => void;
  onNoteChange: (value: string) => void;
}

export const PaymentStep = memo(function PaymentStep({
  selectedPlans,
  businessSelections,
  entitySelections,
  preSelectedBusinessName,
  preSelectedEntityName,
  paymentMethod,
  paymentReference,
  paymentNote,
  error,
  sinpeNumber,
  sinpeName,
  ibanAccount,
  transferName,
  onMethodChange,
  onReferenceChange,
  onNoteChange,
}: PaymentStepProps) {
  return (
    <View style={styles.paymentContainer}>
      <PlansSummary
        selectedPlans={selectedPlans}
        businessSelections={businessSelections}
        entitySelections={entitySelections}
        preSelectedBusinessName={preSelectedBusinessName}
        preSelectedEntityName={preSelectedEntityName}
      />

      <PaymentMethodSelector selectedMethod={paymentMethod} onSelectMethod={onMethodChange} />

      <PaymentInfo
        method={paymentMethod}
        sinpeNumber={sinpeNumber}
        sinpeName={sinpeName}
        ibanAccount={ibanAccount}
        transferName={transferName}
      />

      <PaymentForm
        paymentMethod={paymentMethod}
        paymentReference={paymentReference}
        paymentNote={paymentNote}
        error={error}
        onReferenceChange={onReferenceChange}
        onNoteChange={onNoteChange}
      />
    </View>
  );
});
