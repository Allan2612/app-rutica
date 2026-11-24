import { Platform, Linking } from 'react-native';
import {
  getNameInitials as getInitials,
  getTimeAgo,
  getDaysAgo as getTimeAgoForReview,
} from '@/utils/formatters';

export function openMaps(latitude: number, longitude: number, label?: string) {
  const encodedLabel = encodeURIComponent(label ?? 'Ubicación');
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${encodedLabel}&ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
    default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  });
  Linking.openURL(url);
}

export { getInitials };

export { getTimeAgo };

export { getTimeAgoForReview };
