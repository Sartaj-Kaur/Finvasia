import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PlannerModalScreen() {
  // Use IP address for local testing if needed, or 10.0.2.2 for Android emulator
  // For Expo Go on a physical device, this must be your computer's local LAN IP.
  const webViewUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5173' : 'http://localhost:5173';

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: webViewUrl }} 
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      {/* Fallback overlay text handled cleanly */}
      <View style={styles.header}>
        <Text style={styles.title}>3D Desk Planner</Text>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
