import { memo, useCallback } from 'react';
import { router } from 'expo-router';
import { LegalDocument } from './LegalDocument';
import { PRIVACY_POLICY, PRIVACY_POLICY_VERSION } from './privacyPolicy';

export const PrivacyScreen = memo(function PrivacyScreen() {
  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/register');
  }, []);

  return (
    <LegalDocument
      title="Política de Privacidad"
      subtitle={`Versión ${PRIVACY_POLICY_VERSION}`}
      sections={PRIVACY_POLICY}
      onBack={handleBack}
    />
  );
});

export default PrivacyScreen;
