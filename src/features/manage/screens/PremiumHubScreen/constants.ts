import {
    Tag,
    BarChart3,
    Images,
    Package,
    Camera,
    Calendar,
    Sparkles,
    Crown,
} from 'lucide-react-native';
import type { SubscriptionType } from '@/types/enums';

export const SUBSCRIPTION_CONFIG: Record<
    SubscriptionType,
    {
        icon: typeof Crown;
        iconColor: string;
        iconBg: string;
    }
> = {
    promotions: {
        icon: Tag,
        iconColor: '#f59e0b',
        iconBg: '#fef3c7',
    },
    dashboard: {
        icon: BarChart3,
        iconColor: '#3b82f6',
        iconBg: '#dbeafe',
    },
    gallery_business: {
        icon: Images,
        iconColor: '#8b5cf6',
        iconBg: '#ede9fe',
    },
    package_products: {
        icon: Package,
        iconColor: '#10b981',
        iconBg: '#d1fae5',
    },
    gallery_attractions: {
        icon: Camera,
        iconColor: '#ec4899',
        iconBg: '#fce7f3',
    },
    gallery_events: {
        icon: Calendar,
        iconColor: '#06b6d4',
        iconBg: '#cffafe',
    },
    full_premium: {
        icon: Sparkles,
        iconColor: '#f59e0b',
        iconBg: '#fef3c7',
    },
};

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
    product: 'Productos',
    photo_business: 'Fotos de galería',
    photo_attraction: 'Fotos de galería',
    photo_event: 'Fotos de galería',
    promotion: 'Promociones',
};
