import { Redirect } from 'expo-router';

/**
 * Los eventos se muestran dentro del tab de atracciones.
 * Esta ruta redirige al tab de atracciones.
 */
export default function EventsIndex() {
  return <Redirect href="/(app)/(tabs)/attractions" />;
}
