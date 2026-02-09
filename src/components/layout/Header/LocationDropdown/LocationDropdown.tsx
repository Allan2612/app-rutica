import { memo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Pressable,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MapPin, Locate, X, ChevronLeft, XCircle } from 'lucide-react-native';
import { useLocation, useThemedColors, useLocationDetection, useLocationFilters } from '@/hooks';
import { styles } from './styles';

interface LocationDropdownProps {
  visible: boolean;
  onClose: () => void;
}

type NavigationStep = 'province' | 'canton' | 'district';

interface NavigationState {
  step: NavigationStep;
  selectedProvince: string | null;
  selectedCanton: string | null;
}

export const LocationDropdown = memo(function LocationDropdown({
  visible,
  onClose,
}: LocationDropdownProps) {
  const { location, updateLocation } = useLocation();
  const colors = useThemedColors();
  const { getCurrentLocation, loadingLocation } = useLocationDetection(false);
  const { filteredProvinces, getCantons, getDistricts, isLoading, hasError, hasData } =
    useLocationFilters('');

  const [navigation, setNavigation] = useState<NavigationState>({
    step: 'province',
    selectedProvince: null,
    selectedCanton: null,
  });

  // Detectar ubicación automáticamente al inicio si no hay ubicación
  useEffect(() => {
    const initLocation = async () => {
      if (!location?.province) {
        const detected = await getCurrentLocation();
        if (detected) {
          updateLocation({
            province: detected.province,
            canton: detected.canton,
            district: detected.district,
            coordinates: detected.coordinates || undefined,
            address: detected.address || undefined,
            searchText: detected.searchText || undefined,
          });
        }
      }
    };

    initLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar selección de provincia
  const handleProvinceSelect = useCallback(
    (provinceName: string) => {
      // Actualizar ubicación inmediatamente
      updateLocation({
        province: provinceName,
        canton: null,
        district: null,
        coordinates: undefined,
        address: provinceName,
        searchText: provinceName,
      });

      // Navegar a cantones
      setNavigation({
        step: 'canton',
        selectedProvince: provinceName,
        selectedCanton: null,
      });
    },
    [updateLocation],
  );

  // Manejar selección de cantón
  const handleCantonSelect = useCallback(
    (cantonName: string) => {
      const { selectedProvince } = navigation;

      if (selectedProvince) {
        // Actualizar ubicación inmediatamente
        updateLocation({
          province: selectedProvince,
          canton: cantonName,
          district: null,
          coordinates: undefined,
          address: `${cantonName}, ${selectedProvince}`,
          searchText: `${cantonName}, ${selectedProvince}`,
        });
      }

      // Navegar a distritos
      setNavigation((prev) => ({
        ...prev,
        step: 'district',
        selectedCanton: cantonName,
      }));
    },
    [navigation, updateLocation],
  );

  // Manejar selección de distrito
  const handleDistrictSelect = useCallback(
    (districtName: string) => {
      const { selectedProvince, selectedCanton } = navigation;

      if (selectedProvince && selectedCanton) {
        // Actualizar ubicación con distrito completo
        updateLocation({
          province: selectedProvince,
          canton: selectedCanton,
          district: districtName,
          coordinates: undefined,
          address: `${districtName}, ${selectedCanton}, ${selectedProvince}`,
          searchText: `${districtName}, ${selectedCanton}, ${selectedProvince}`,
        });
        onClose();
        setNavigation({
          step: 'province',
          selectedProvince: null,
          selectedCanton: null,
        });
      }
    },
    [navigation, updateLocation, onClose],
  );

  // Manejar retroceso
  const handleBack = useCallback(() => {
    setNavigation((prev) => {
      if (prev.step === 'district') {
        return {
          ...prev,
          step: 'canton',
          selectedCanton: null,
        };
      }
      if (prev.step === 'canton') {
        return {
          step: 'province',
          selectedProvince: null,
          selectedCanton: null,
        };
      }
      return prev;
    });
  }, []);

  // Manejar detección de ubicación
  const handleDetectLocation = useCallback(async () => {
    const detected = await getCurrentLocation();
    if (detected) {
      updateLocation({
        province: detected.province,
        canton: detected.canton,
        district: detected.district,
        coordinates: detected.coordinates || undefined,
        address: detected.address || undefined,
        searchText: detected.searchText || undefined,
      });
      onClose();
      setNavigation({
        step: 'province',
        selectedProvince: null,
        selectedCanton: null,
      });
    }
  }, [getCurrentLocation, updateLocation, onClose]);

  // Manejar cierre
  const handleClose = useCallback(() => {
    onClose();
    setNavigation({
      step: 'province',
      selectedProvince: null,
      selectedCanton: null,
    });
  }, [onClose]);

  // Manejar limpiar ubicación
  const handleClearLocation = useCallback(() => {
    updateLocation({
      province: null,
      canton: null,
      district: null,
      coordinates: undefined,
      address: undefined,
      searchText: undefined,
    });
    setNavigation({
      step: 'province',
      selectedProvince: null,
      selectedCanton: null,
    });
  }, [updateLocation]);

  // Obtener texto del botón principal
  const getButtonText = () => {
    if (location?.district && location?.canton && location?.province) {
      return `${location.district}, ${location.canton}, ${location.province}`;
    }
    if (location?.canton && location?.province) {
      return `${location.canton}, ${location.province}`;
    }
    if (location?.province) {
      return location.province;
    }
    return 'Seleccionar ubicación';
  };

  // Obtener título según el paso de navegación
  const getTitle = () => {
    if (navigation.step === 'district') {
      return `Distritos de ${navigation.selectedCanton}`;
    }
    if (navigation.step === 'canton') {
      return `Cantones de ${navigation.selectedProvince}`;
    }
    return 'Seleccionar Provincia';
  };

  // Obtener datos a mostrar según el paso
  const getCurrentData = () => {
    if (isLoading) return [];

    if (navigation.step === 'province') {
      return filteredProvinces.map((p) => ({ id: p.id, name: p.name }));
    }

    if (navigation.step === 'canton' && navigation.selectedProvince) {
      return getCantons(navigation.selectedProvince).map((c) => ({ id: c.id, name: c.name }));
    }

    if (navigation.step === 'district' && navigation.selectedCanton) {
      return getDistricts(navigation.selectedCanton).map((d) => ({ id: d.id, name: d.name }));
    }

    return [];
  };

  // Manejar selección según el paso actual
  const handleItemSelect = (name: string) => {
    if (navigation.step === 'province') {
      handleProvinceSelect(name);
    } else if (navigation.step === 'canton') {
      handleCantonSelect(name);
    } else if (navigation.step === 'district') {
      handleDistrictSelect(name);
    }
  };

  if (!visible) return null;

  const currentData = getCurrentData();
  const showBackButton = navigation.step !== 'province';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable
          style={[styles.container, { backgroundColor: colors.background.primary }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border.medium }]}>
            {showBackButton ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ChevronLeft size={24} color={colors.text.primary} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButton} />
            )}
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>{getTitle()}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Botón de ubicación actual */}
          <View style={styles.currentLocationSection}>
            <View
              style={[
                styles.searchButton,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.medium,
                },
              ]}
            >
              <MapPin size={18} color={colors.text.secondary} />
              <Text
                style={[styles.searchButtonText, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {getButtonText()}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.background.secondary,
                  borderColor: colors.border.medium,
                },
              ]}
              onPress={handleClearLocation}
              activeOpacity={0.7}
            >
              <XCircle size={18} color={colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: loadingLocation
                    ? colors.background.tertiary
                    : colors.primary[500],
                  borderColor: loadingLocation ? colors.border.medium : colors.primary[500],
                },
              ]}
              onPress={handleDetectLocation}
              disabled={loadingLocation}
              activeOpacity={0.7}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color={colors.text.secondary} />
              ) : (
                <Locate size={18} color={colors.text.inverse} />
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de ubicaciones */}
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {isLoading && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={[styles.messageText, { color: colors.text.secondary }]}>
                  Cargando ubicaciones...
                </Text>
              </View>
            )}

            {!isLoading && (hasError || !hasData) && (
              <View style={styles.centerContainer}>
                <Text style={[styles.messageTitle, { color: colors.text.primary }]}>
                  Sin ubicación
                </Text>
                <Text style={[styles.messageText, { color: colors.text.tertiary }]}>
                  No se pudieron cargar las ubicaciones
                </Text>
              </View>
            )}

            {!isLoading && hasData && currentData.length === 0 && (
              <View style={styles.centerContainer}>
                <Text style={[styles.messageText, { color: colors.text.secondary }]}>
                  No hay ubicaciones disponibles
                </Text>
              </View>
            )}

            {!isLoading &&
              hasData &&
              currentData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.listItem,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.light,
                    },
                  ]}
                  onPress={() => handleItemSelect(item.name)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.listItemText, { color: colors.text.primary }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});
