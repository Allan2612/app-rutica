import { StyleSheet } from 'react-native';
import { getShadowStyle } from '../../../utils/shadowHelper';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    gap: 8,
  },
  loadingAddressText: {
    fontSize: 12,
    color: '#0066cc',
  },
  coordinatesWeb: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
    zIndex: 1000,
    ...getShadowStyle({
      color: '#000',
      offsetY: 2,
      opacity: 0.2,
      radius: 4,
      elevation: 3,
    }),
  },
  coordText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hint: {
    padding: 8,
    backgroundColor: '#f0f9ff',
    color: '#0066cc',
    fontSize: 12,
    textAlign: 'center',
  },
});
