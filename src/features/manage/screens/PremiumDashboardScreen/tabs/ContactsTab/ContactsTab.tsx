import { memo } from 'react';
import { BusinessSelector } from '../../components/BusinessSelector';
import { PeriodFilter } from '../../components/PeriodFilter';
import {
  ContactsSummaryCards,
  TopContactHighlight,
  ContactsTrendChart,
  ContactsBarChart,
  ContactsPieChart,
  ContactTypesList,
  ContactsEmptyState,
} from './components';
import type { ContactType } from '@/services/contactClicks.service';
import type {
  BaseTabProps,
  PeriodType,
  ChartDataItem,
  ContactBarDataItem,
  PieChartDataItem,
  BusinessOption,
} from '../../../../../../types/entities/premium';

interface ContactStats {
  totalClicks: number;
  topContactType?: {
    contactType: ContactType;
    count: number;
    label: string;
    shortLabel: string;
  };
  clicksByType: Array<{
    contactType: ContactType;
    count: number;
    label: string;
    shortLabel: string;
  }>;
  dailyTrend: Array<{ label: string; count: number }>;
  growthPercentage: number;
}

interface ContactsTabProps extends BaseTabProps {
  businessOptions?: BusinessOption[];
  selectedBusinessId: string | null;
  onSelectBusiness: (id: string | null) => void;
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  contactStats: ContactStats | undefined;
  contactLineData: ChartDataItem[];
  contactBarData: ContactBarDataItem[];
  contactPieData: PieChartDataItem[];
  visibleContactTypes: Set<ContactType>;
  onToggleContactType: (type: ContactType) => void;
}

export const ContactsTab = memo(function ContactsTab({
  colors,
  businessOptions,
  selectedBusinessId,
  onSelectBusiness,
  period,
  onPeriodChange,
  contactStats,
  contactLineData,
  contactBarData,
  contactPieData,
  visibleContactTypes,
  onToggleContactType,
}: ContactsTabProps) {
  return (
    <>
      {/* Business Selector */}
      {businessOptions && businessOptions.length > 0 && (
        <BusinessSelector
          businessOptions={businessOptions}
          selectedBusinessId={selectedBusinessId}
          onSelectBusiness={onSelectBusiness}
          colors={colors}
          showStoreIcon
        />
      )}

      {/* Period Filter */}
      <PeriodFilter selectedPeriod={period} onSelectPeriod={onPeriodChange} colors={colors} />

      {/* Summary Cards */}
      <ContactsSummaryCards
        colors={colors}
        totalClicks={contactStats?.totalClicks ?? 0}
        growthPercentage={contactStats?.growthPercentage ?? 0}
        channelsCount={contactStats?.clicksByType?.length ?? 0}
      />

      {/* Top Contact Highlight */}
      {contactStats?.topContactType && contactStats.topContactType.count > 0 && (
        <TopContactHighlight colors={colors} topContactType={contactStats.topContactType} />
      )}

      {/* Contact Trend Chart */}
      <ContactsTrendChart colors={colors} contactLineData={contactLineData} period={period} />

      {/* Contact Bar Chart */}
      <ContactsBarChart
        colors={colors}
        contactBarData={contactBarData}
        clicksByType={contactStats?.clicksByType ?? []}
        visibleContactTypes={visibleContactTypes}
        onToggleContactType={onToggleContactType}
      />

      {/* Pie Chart */}
      <ContactsPieChart
        colors={colors}
        contactPieData={contactPieData}
        totalClicks={contactStats?.totalClicks ?? 0}
        selectedBusinessId={selectedBusinessId}
      />

      {/* Contact Types List */}
      <ContactTypesList colors={colors} clicksByType={contactStats?.clicksByType ?? []} />

      {/* Empty State */}
      {contactStats && contactStats.totalClicks === 0 && <ContactsEmptyState colors={colors} />}
    </>
  );
});
