import { memo } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface IOSDateTimePickerModalProps {
  visible: boolean;
  tempDate: Date;
  type: 'date' | 'time';
  minDate?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

export const IOSDateTimePickerModal = memo(function IOSDateTimePickerModal({
  visible,
  tempDate,
  type,
  minDate,
  onConfirm,
  onCancel,
  onChange,
}: IOSDateTimePickerModalProps) {
  const colors = useThemedColors();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <Pressable
        style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
        onPress={onCancel}
      >
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.background.primary }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.modalHeader, { borderBottomColor: colors.border.light }]}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={[styles.modalCancelText, { color: colors.error }]}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              {type === 'date' ? 'Seleccionar Fecha' : 'Seleccionar Hora'}
            </Text>
            <TouchableOpacity onPress={onConfirm}>
              <Text style={[styles.modalConfirmText, { color: colors.primary[500] }]}>Listo</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={tempDate}
            mode={type}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
            minimumDate={minDate ? new Date(minDate) : undefined}
            themeVariant={colors.isDark ? 'dark' : 'light'}
            textColor={colors.text.primary}
            accentColor={colors.primary[500]}
            style={styles.iosPicker}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
});
