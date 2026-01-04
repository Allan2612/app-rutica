import { View, Text, StyleSheet } from 'react-native';

export default function BusinessesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏪 Comercios</Text>
      <Text style={styles.subtitle}>Lista de comercios</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
