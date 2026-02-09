// ============================================
// Unified Verification Detail Modal
// Uses entity-specific DetailViews for optimized rendering
// ============================================

import { memo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import {
  BusinessDetailView,
  EventDetailView,
  AttractionDetailView,
  PromotionDetailView,
} from '../DetailViews';
import type {
  VerificationRequest,
  BusinessVerificationRequest,
  EventVerificationRequest,
  AttractionVerificationRequest,
  PromotionVerificationRequest,
} from '@/features/admin/types';

interface VerificationDetailModalProps {
  visible: boolean;
  request: VerificationRequest | null;
  onClose: () => void;
  onToggleActive?: (id: string, type: string, isActive: boolean) => void;
  isProcessing?: boolean;
}

export const VerificationDetailModal = memo(function VerificationDetailModal({
  visible,
  request,
  onClose,
  onToggleActive,
  isProcessing = false,
}: VerificationDetailModalProps) {
  const colors = useThemedColors();

  const handleToggleActive = useCallback(
    (isActive: boolean) => {
      if (request && onToggleActive) {
        onToggleActive(request.id, request.type, isActive);
      }
    },
    [request, onToggleActive],
  );

  if (!request) return null;

  // Render the appropriate detail view based on entity type
  // Note: onToggleActive is intentionally NOT passed to keep DetailViews read-only
  const renderDetailView = () => {
    switch (request.type) {
      case 'business':
        return (
          <BusinessDetailView
            request={request as BusinessVerificationRequest}
            isProcessing={isProcessing}
          />
        );
      case 'event':
        return (
          <EventDetailView
            request={request as EventVerificationRequest}
            isProcessing={isProcessing}
          />
        );
      case 'attraction':
        return (
          <AttractionDetailView
            request={request as AttractionVerificationRequest}
            isProcessing={isProcessing}
          />
        );
      case 'promotion':
        return (
          <PromotionDetailView
            request={request as PromotionVerificationRequest}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayBackground} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Información Detallada
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: pressed ? colors.background.tertiary : 'transparent' },
              ]}
            >
              <X size={24} color={colors.text.secondary} />
            </Pressable>
          </View>

          {/* Content - Entity-specific DetailView */}
          <View style={[styles.contentWrapper, { backgroundColor: colors.background.primary }]}>
            {renderDetailView()}
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed ? colors.primary[600] : colors.primary[500],
                },
              ]}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const { height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 20 : 0,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  modalContainer: {
    flexDirection: 'column',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    height: Platform.OS === 'web' ? undefined : '100%',
    maxHeight: Platform.OS === 'web' ? '90%' : '100%',
    borderRadius: Platform.OS === 'web' ? 16 : 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : isSmallScreen ? 12 : 50,
    borderBottomWidth: 1,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'web' ? 16 : isSmallScreen ? 16 : 34,
    borderTopWidth: 1,
    flexShrink: 0,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
