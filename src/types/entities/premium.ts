import type { ContactType } from '@/services/contactClicks.service';

export type TabType = 'favorites' | 'contacts' | 'reviews';

export type PeriodType = 7 | 15 | 30 | 90;

export type ReviewType = 'all' | 'business' | 'product';

// Tipo para los colores del tema
export type ThemedColors = ReturnType<typeof import('@/hooks').useThemedColors>;

export interface BusinessOption {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface PeakDayData {
  label: string;
  count: number;
  date?: string;
  formattedDate: string;
}

export interface ChartDataItem {
  value: number;
  label: string;
  dataPointText?: string;
}

export interface BarChartDataItem {
  value: number;
  label: string;
  frontColor: string;
  topLabelComponent?: () => React.ReactNode;
}

export interface PieChartDataItem {
  value: number;
  color: string;
  text: string;
  label: string;
}

export interface ReviewPieDataItem extends PieChartDataItem {
  stars?: number;
}

export interface ContactBarDataItem {
  value: number;
  label: string;
  frontColor: string;
}

// Props compartidas para componentes de tabs
export interface BaseTabProps {
  colors: ThemedColors;
}

// Props para BusinessSelector
export interface BusinessSelectorProps {
  businessOptions: BusinessOption[];
  selectedBusinessId: string | null;
  onSelectBusiness: (id: string | null) => void;
  colors: BaseTabProps['colors'];
}

// Props para PeriodFilter
export interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onSelectPeriod: (period: PeriodType) => void;
  colors: BaseTabProps['colors'];
}

// Props para ReviewTypeFilter
export interface ReviewTypeFilterProps {
  selectedType: ReviewType;
  onSelectType: (type: ReviewType) => void;
  colors: BaseTabProps['colors'];
}

// Props para SummaryCard
export interface SummaryCardProps {
  icon: React.ReactNode;
  iconBackgroundColor: string;
  value: string | number;
  label: string;
  valueColor?: string;
  valueStyle?: object;
  colors: BaseTabProps['colors'];
}

// Props para HighlightCard
export interface HighlightCardProps {
  icon: React.ReactNode;
  title: string;
  logoUrl?: string;
  logoPlaceholder: React.ReactNode;
  name: string;
  statsIcon: React.ReactNode;
  statsText: string;
  colors: BaseTabProps['colors'];
}

// Props para ChartCard
export interface ChartCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  colors: BaseTabProps['colors'];
}

// Props para PieChartWithLegend
export interface PieChartWithLegendProps {
  data: PieChartDataItem[];
  centerValue: string | number;
  centerLabel: string;
  centerIcon?: React.ReactNode;
  colors: BaseTabProps['colors'];
}

// Constante de colores de contacto exportada para tipado
export type ContactColorKey = ContactType;

// Interface para estadísticas de reseñas
export interface ReviewStats {
  totalBusinessReviews: number;
  totalProductReviews: number;
  overallAverageRating: number;
  businessesStats: Array<{
    businessId: string;
    businessName: string;
    logoUrl?: string;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      stars5: number;
      stars4: number;
      stars3: number;
      stars2: number;
      stars1: number;
    };
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    businessName: string;
    totalReviews: number;
    averageRating: number;
  }>;
  recentReviews: Array<{
    id: string;
    type: 'business' | 'product';
    entityName: string;
    rating: number;
    comment?: string;
    authorName: string;
    createdAt: string;
  }>;
  ratingTrend: Array<{
    label: string;
    count: number;
    averageRating: number;
  }>;
}
