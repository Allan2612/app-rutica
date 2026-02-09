/**
 * Tipos para LocationPicker
 */

export interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
}

export interface LocationPickerProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (data: LocationData) => void;
  height?: number;
}

export interface LocationPickerState {
  latitude: number;
  longitude: number;
  loading: boolean;
  loadingLocation: boolean;
  mapKey: number;
}
