import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles, ITEM_HEIGHT, VISIBLE_ITEMS } from './styles';

interface TimePickerProps {
  selectedTime: { hours: number; minutes: number };
  onTimeChange: (time: { hours: number; minutes: number }) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

interface WheelColumnProps {
  data: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
}

const WheelColumn = memo(function WheelColumn({
  data,
  selectedValue,
  onValueChange,
}: WheelColumnProps) {
  const colors = useThemedColors();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!isScrolling) {
      const index = data.indexOf(selectedValue);
      scrollViewRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selectedValue, data, isScrolling]);

  const handleScrollEnd = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
      onValueChange(data[clampedIndex]);
      setIsScrolling(false);
    },
    [data, onValueChange],
  );

  const handleScrollBegin = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleItemPress = useCallback(
    (value: number) => {
      onValueChange(value);
      const index = data.indexOf(value);
      scrollViewRef.current?.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    },
    [data, onValueChange],
  );

  return (
    <View style={styles.wheelColumn}>
      {/* Indicador de selección */}
      <View
        style={[styles.selectionIndicator, { backgroundColor: colors.primary[500] + '20' }]}
        pointerEvents="none"
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
        }}
      >
        {data.map((value) => {
          const isSelected = value === selectedValue;
          return (
            <Pressable key={value} onPress={() => handleItemPress(value)} style={styles.wheelItem}>
              <Text
                style={[
                  styles.wheelItemText,
                  { color: colors.text.primary },
                  isSelected && [styles.selectedItemText, { color: colors.primary[500] }],
                ]}
              >
                {String(value).padStart(2, '0')}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

export const TimePicker = memo(function TimePicker({
  selectedTime,
  onTimeChange,
}: TimePickerProps) {
  const colors = useThemedColors();

  const handleHoursChange = useCallback(
    (hours: number) => {
      onTimeChange({ ...selectedTime, hours });
    },
    [selectedTime, onTimeChange],
  );

  const handleMinutesChange = useCallback(
    (minutes: number) => {
      onTimeChange({ ...selectedTime, minutes });
    },
    [selectedTime, onTimeChange],
  );

  return (
    <View style={styles.container}>
      <WheelColumn
        data={HOURS}
        selectedValue={selectedTime.hours}
        onValueChange={handleHoursChange}
      />
      <Text style={[styles.separator, { color: colors.text.primary }]}>:</Text>
      <WheelColumn
        data={MINUTES}
        selectedValue={selectedTime.minutes}
        onValueChange={handleMinutesChange}
      />
    </View>
  );
});
