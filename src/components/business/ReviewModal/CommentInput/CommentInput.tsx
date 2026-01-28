import { memo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from '../styles';

interface CommentInputProps {
    comment: string;
    onCommentChange: (comment: string) => void;
    disabled?: boolean;
}

export const CommentInput = memo(function CommentInput({
    comment,
    onCommentChange,
    disabled = false,
}: CommentInputProps) {
    const colors = useThemedColors();

    return (
        <View style={styles.commentSection}>
            <Text style={[styles.label, { color: colors.text.primary }]}>
                Comentario <Text style={[styles.optional, { color: colors.text.tertiary }]}>(opcional)</Text>
            </Text>
            <TextInput
                style={[styles.textInput, {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.medium,
                    color: colors.text.primary,
                }]}
                placeholder="Cuéntanos sobre tu experiencia..."
                placeholderTextColor={colors.text.tertiary}
                value={comment}
                onChangeText={onCommentChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!disabled}
            />
            <Text style={[styles.charCount, { color: colors.text.tertiary }]}>
                {comment.length} caracteres
            </Text>
        </View>
    );
});
