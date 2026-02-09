import { Linking, Platform } from 'react-native';

export function formatEventDate(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const now = new Date();

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };

  if (start.toDateString() === now.toDateString()) {
    return `Hoy, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (start.toDateString() === tomorrow.toDateString()) {
    return `Mañana, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
  }

  if (start.toDateString() === end.toDateString()) {
    return `${capitalizeFirst(start.toLocaleDateString('es-CR', dateOptions))}, ${start.toLocaleTimeString('es-CR', timeOptions)}`;
  }

  const startDate = capitalizeFirst(
    start.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' }),
  );
  const endDate = capitalizeFirst(
    end.toLocaleDateString('es-CR', { day: 'numeric', month: 'long' }),
  );
  const startTime = start.toLocaleTimeString('es-CR', timeOptions);
  const endTime = end.toLocaleTimeString('es-CR', timeOptions);
  return `${startDate} - ${startTime} a ${endDate} - ${endTime}`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPrice(
  isFree: boolean,
  price?: number | null,
  currency?: string | null,
): string {
  if (isFree) return 'Gratis';
  if (!price) return 'Consultar';
  const currencyCode = currency ?? 'CRC';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(price);
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-CR', { day: 'numeric', month: 'short' });
}

export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function openMaps(latitude: number, longitude: number, label?: string) {
  const encodedLabel = encodeURIComponent(label ?? 'Ubicación');
  const url = Platform.select({
    ios: `http://maps.apple.com/?q=${encodedLabel}&ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
    default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  });
  Linking.openURL(url);
}

export function extractSocialUsername(url: string): string {
  let cleaned = url.replace(/^https?:\/\/(www\.)?/, '');
  const parts = cleaned.split('/');
  if (parts.length > 1) {
    const username = parts[1].replace('@', '');
    return username ? `@${username}` : url;
  }
  return cleaned.replace('@', '') ? `@${cleaned.replace('@', '')}` : url;
}
