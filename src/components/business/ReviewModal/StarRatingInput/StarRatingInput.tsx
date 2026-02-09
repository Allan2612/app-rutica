import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface StarRatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export const StarRatingInput = memo(function StarRatingInput({
  rating,
  onRatingChange,
  disabled = false,
}: StarRatingInputProps) {
  const colors = useThemedColors();

  return (
    <View style={styles.ratingSection}>
      <Text style={[styles.label, { color: colors.text.primary }]}>
        Calificación <Text style={{ color: colors.error }}>*</Text>
      </Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Pressable
            key={i}
            onPress={() => onRatingChange(i)}
            disabled={disabled}
            style={styles.starButton}
          >
            <Star
              size={32}
              color="#fbbf24"
              fill={i <= rating ? '#fbbf24' : 'transparent'}
              strokeWidth={1.5}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
});
