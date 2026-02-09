import { memo, useState, useCallback, useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { UnifiedDateTimeModal } from '../UnifiedDateTimeModal';
import { styles } from './styles';

interface SimpleDateTimeInputProps {
  date: Date;
  onDateChange: (date: Date) => void;
  type: 'date' | 'time';
  label?: string;
  error?: string;
  minDate?: string;
  /** Si es true, no permite fechas pasadas (por defecto true para type='date') */
  disablePastDates?: boolean;
}

export const SimpleDateTimeInput = memo(function SimpleDateTimeInput({
  date,
  onDateChange,
  type,
  label,
  error,
  minDate,
  disablePastDates = true,
}: SimpleDateTimeInputProps) {
  const colors = useThemedColors();
  const [modalVisible, setModalVisible] = useState(false);

  // Calcular la fecha mínima: usar la proporcionada o la fecha actual
  const effectiveMinDate = useMemo(() => {
    if (type !== 'date') return undefined;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    if (disablePastDates) {
      if (minDate) {
        // Usar la más reciente entre minDate y hoy
        return minDate > todayString ? minDate : todayString;
      }
      return todayString;
    }

    return minDate;
  }, [type, minDate, disablePastDates]);

  const formatForDisplay = useCallback(
    (d: Date): string => {
      if (type === 'date') {
        return d.toLocaleDateString('es-CR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } else {
        return d.toLocaleTimeString('es-CR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    },
    [type],
  );

  const handleOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleConfirm = useCallback(
    (newDate: Date) => {
      onDateChange(newDate);
    },
    [onDateChange],
  );

  const Icon = type === 'date' ? Calendar : Clock;

  return (
    <>
      <Pressable
        style={[
          styles.button,
          {
            backgroundColor: colors.background.secondary,
            borderColor: error ? colors.error : colors.border.medium,
          },
        ]}
        onPress={handleOpenModal}
      >
        <Icon size={20} color={colors.text.primary} />
        <Text style={[styles.text, { color: colors.text.primary }]}>{formatForDisplay(date)}</Text>
      </Pressable>

      <UnifiedDateTimeModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        initialDate={date}
        type={type}
        title={type === 'date' ? 'Seleccionar Fecha' : 'Seleccionar Hora'}
        minDate={effectiveMinDate}
      />
    </>
  );
});
