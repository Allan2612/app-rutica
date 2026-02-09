import { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { BarChart3 } from 'lucide-react-native';
import { styles } from './styles';
import { CONTACT_ICONS, CONTACT_COLORS } from '@/styles/premium-section-styles';
import type { ContactType } from '@/services/contactClicks.service';
import type {
  ContactBarDataItem,
  ThemedColors,
} from '../../../../../../../../types/entities/premium';

interface ClicksByType {
  contactType: ContactType;
  label: string;
}

interface ContactsBarChartProps {
  colors: ThemedColors;
  contactBarData: ContactBarDataItem[];
  clicksByType: ClicksByType[];
  visibleContactTypes: Set<ContactType>;
  onToggleContactType: (type: ContactType) => void;
}

export const ContactsBarChart = memo(function ContactsBarChart({
  colors,
  contactBarData,
  clicksByType,
  visibleContactTypes,
  onToggleContactType,
}: ContactsBarChartProps) {
  if (contactBarData.length === 0) return null;

  const maxValue = Math.max(...contactBarData.map((d) => d.value), 1);
  const scaleNumbers = Array.from({ length: 5 }, (_, i) =>
    i === 0 ? 0 : Math.round((maxValue / 4) * i),
  );

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.background.primary, borderColor: colors.border.light },
      ]}
    >
      <View style={styles.chartHeader}>
        <BarChart3 color="#8b5cf6" size={20} strokeWidth={2} />
        <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
          Clicks por Tipo de Contacto
        </Text>
      </View>
      <Text style={[styles.chartSubtitle, { color: colors.text.secondary }]}>
        Comparativa de canales de contacto
      </Text>

      {/* Filtros de tipos de contacto */}
      {clicksByType.length > 0 && (
        <View style={{ marginTop: 12, marginBottom: 16, paddingHorizontal: 16 }}>
          {Array.from({ length: Math.ceil(clicksByType.length / 2) }, (_, rowIndex) => {
            const startIdx = rowIndex * 2;
            const rowItems = clicksByType.slice(startIdx, startIdx + 2);
            return (
              <View
                key={rowIndex}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: rowIndex < Math.ceil(clicksByType.length / 2) - 1 ? 8 : 0,
                }}
              >
                {rowItems.map((item) => {
                  const IconComponent = CONTACT_ICONS[item.contactType];
                  const isVisible = visibleContactTypes.has(item.contactType);
                  return (
                    <Pressable
                      key={item.contactType}
                      onPress={() => onToggleContactType(item.contactType)}
                      style={[
                        styles.filterToggle,
                        isVisible
                          ? {
                              backgroundColor: CONTACT_COLORS[item.contactType],
                              borderColor: CONTACT_COLORS[item.contactType],
                            }
                          : {
                              backgroundColor: colors.background.secondary,
                              borderColor: colors.border.light,
                              opacity: 0.5,
                            },
                      ]}
                    >
                      <IconComponent
                        color={isVisible ? '#ffffff' : colors.text.tertiary}
                        size={14}
                        strokeWidth={2}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.filterToggleText,
                          { color: isVisible ? '#ffffff' : colors.text.tertiary },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}

      {/* Custom Bar Chart */}
      <View style={[styles.chartContainer, { paddingTop: 8, paddingBottom: 16 }]}>
        <View>
          {contactBarData.map((item, index) => {
            const barWidthPercent = (item.value / maxValue) * 100;
            const showNumberInside = barWidthPercent >= 20;
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                  paddingLeft: 16,
                  paddingRight: 20,
                }}
              >
                <Text
                  style={{
                    width: 75,
                    fontSize: 11,
                    fontWeight: '600',
                    color: colors.text.secondary,
                    textAlign: 'left',
                    marginRight: 12,
                  }}
                >
                  {item.label}
                </Text>
                <View style={{ flex: 1, position: 'relative' }}>
                  <View
                    style={{
                      width: '100%',
                      height: 32,
                      backgroundColor: `${colors.border.light}25`,
                      borderRadius: 6,
                    }}
                  >
                    <View
                      style={{
                        width: `${barWidthPercent}%`,
                        height: '100%',
                        backgroundColor: item.frontColor,
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: showNumberInside ? 40 : 0,
                      }}
                    >
                      {showNumberInside && (
                        <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                          {item.value}
                        </Text>
                      )}
                    </View>
                  </View>
                  {!showNumberInside && (
                    <Text
                      style={{
                        position: 'absolute',
                        left: `${barWidthPercent}%`,
                        top: 0,
                        bottom: 0,
                        marginLeft: 8,
                        lineHeight: 32,
                        color: colors.text.primary,
                        fontSize: 12,
                        fontWeight: '700',
                      }}
                    >
                      {item.value}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
          <View style={{ flexDirection: 'row', marginTop: 12, paddingLeft: 16, paddingRight: 20 }}>
            <View style={{ width: 87 }} />
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              {scaleNumbers.map((num, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: colors.text.tertiary,
                    textAlign:
                      i === 0 ? 'left' : i === scaleNumbers.length - 1 ? 'right' : 'center',
                    minWidth: 20,
                  }}
                >
                  {num}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});
