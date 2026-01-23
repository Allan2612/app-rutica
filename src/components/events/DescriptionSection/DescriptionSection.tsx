import { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemedColors } from '@/hooks';
import { styles } from './styles';

interface DescriptionSectionProps {
    description: string | null;
    showTitle?: boolean;
}

export const DescriptionSection = memo(({ description, showTitle = true }: DescriptionSectionProps) => {
    const colors = useThemedColors();
    const [expanded, setExpanded] = useState(false);

    if (!description) return null;

    const shouldTruncate = description.length > 200;
    const displayText = shouldTruncate && !expanded
        ? `${description.substring(0, 200)}...`
        : description;

    return (
        <View style={showTitle ? styles.section : styles.sectionNoTitle}>
            {showTitle && (
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Descripción</Text>
            )}
            <Text style={[styles.descriptionText, { color: colors.text.secondary }]}>
                {displayText}
            </Text>
            {shouldTruncate && (
                <Pressable onPress={() => setExpanded(!expanded)}>
                    <Text style={[styles.readMoreText, { color: colors.primary[500] }]}>
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </Text>
                </Pressable>
            )}
        </View>
    );
});

DescriptionSection.displayName = 'DescriptionSection';
