import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  elementsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
});
