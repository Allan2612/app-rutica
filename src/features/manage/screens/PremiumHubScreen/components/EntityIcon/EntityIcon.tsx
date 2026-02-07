import { memo } from 'react';
import { Store, MapPin, Calendar } from 'lucide-react-native';

interface EntityIconProps {
    type: 'business' | 'attraction' | 'event';
    color: string;
    size?: number;
}

export const EntityIcon = memo(function EntityIcon({
    type,
    color,
    size = 14,
}: EntityIconProps) {
    switch (type) {
        case 'business':
            return <Store size={size} color={color} />;
        case 'attraction':
            return <MapPin size={size} color={color} />;
        case 'event':
            return <Calendar size={size} color={color} />;
        default:
            return null;
    }
});
