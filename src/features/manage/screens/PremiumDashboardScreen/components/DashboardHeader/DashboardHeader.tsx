import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BarChart3, Heart, MousePointerClick, Star } from 'lucide-react-native';
import { BackButton } from '@/components/ui';
import { styles } from './styles';
import type { TabType, BaseTabProps } from '../../../../../../types/entities/premium';

interface DashboardHeaderProps extends BaseTabProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showTabs: boolean;
}

export const DashboardHeader = memo(function DashboardHeader({
  colors,
  activeTab,
  onTabChange,
  showTabs,
}: DashboardHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        { borderBottomColor: colors.border.light, backgroundColor: colors.background.secondary },
      ]}
    >
      <View style={styles.headerRow}>
        <BackButton href="/(app)/(tabs)/manage/premium" />
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <BarChart3 color={colors.primary[500]} size={24} strokeWidth={2} />
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              Dashboard Premium
            </Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            Analítica detallada de tus negocios
          </Text>
        </View>
      </View>

      {showTabs && (
        <View style={styles.tabsContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'favorites' && styles.tabActive,
              activeTab === 'favorites' && { borderBottomColor: colors.primary[500] },
            ]}
            onPress={() => onTabChange('favorites')}
          >
            <Heart
              color={activeTab === 'favorites' ? colors.primary[500] : colors.text.tertiary}
              size={16}
              strokeWidth={2}
              fill={activeTab === 'favorites' ? colors.primary[500] : 'transparent'}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'favorites' ? colors.primary[500] : colors.text.tertiary },
                activeTab === 'favorites' && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              Favoritos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'contacts' && styles.tabActive,
              activeTab === 'contacts' && { borderBottomColor: colors.primary[500] },
            ]}
            onPress={() => onTabChange('contacts')}
          >
            <MousePointerClick
              color={activeTab === 'contacts' ? colors.primary[500] : colors.text.tertiary}
              size={16}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'contacts' ? colors.primary[500] : colors.text.tertiary },
                activeTab === 'contacts' && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              Interacciones
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === 'reviews' && styles.tabActive,
              activeTab === 'reviews' && { borderBottomColor: colors.primary[500] },
            ]}
            onPress={() => onTabChange('reviews')}
          >
            <Star
              color={activeTab === 'reviews' ? colors.primary[500] : colors.text.tertiary}
              size={16}
              strokeWidth={2}
              fill={activeTab === 'reviews' ? colors.primary[500] : 'transparent'}
            />
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'reviews' ? colors.primary[500] : colors.text.tertiary },
                activeTab === 'reviews' && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              Reseñas
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});
