import { View, Text, StyleSheet } from 'react-native';

export default function GoalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your Goals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#9da3af' }
});
