import { Clock, CheckCircle, XCircle, TimerOff } from 'lucide-react-native';

export const statusConfig = {
    pending: { color: '#eab308', icon: Clock, label: 'Pendiente' },
    approved: { color: '#10b981', icon: CheckCircle, label: 'Aprobada' },
    rejected: { color: '#ef4444', icon: XCircle, label: 'Rechazada' },
    cancelled: { color: '#6b7280', icon: XCircle, label: 'Cancelada' },
    expired: { color: '#f59e0b', icon: TimerOff, label: 'Expirada' },
} as const;

export function getUserName(profile?: any): string {
    if (!profile) return 'Usuario desconocido';
    return [profile.first_name_prf, profile.last_name1_prf, profile.last_name2_prf]
        .filter(Boolean)
        .join(' ') || 'Usuario desconocido';
}
