import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';

const theme = Colors.light;

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.dateStamp}>
          <Text style={styles.dateStampText}>MAR 31, 2026</Text>
        </View>

        <Text style={styles.salutation}>Dear Navya,</Text>
        
        <Text style={styles.bodyText}>
          March was a quiet month, and quiet is good. You managed to rein in the impulsive weekend spending, and we are starting to see the compound effects taking root.{"\n\n"}
          You’ll notice that those extra ₹500 you decided not to spend on coffee last week were immediately salvaged and put to work. I’ve securely routed the surplus to your New Phone Fund, inching you 5% closer to the target.{"\n\n"}
          As we move into April, your FinTwin noticed a pattern. When you log a "Stressed" mood, your food delivery expenses spike by almost 40% over the next 48 hours. Let's keep a gentle eye on that this week.{"\n\n"}
          Remember: small habits now mean absolute freedom later. You're doing the hard work. I'm just keeping track.
        </Text>

        <Text style={styles.signOff}>
          Warmly,{"\n"}
          <Text style={styles.signature}>Monager</Text>
        </Text>

      </ScrollView>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.paper,
  },
  scrollContent: {
    padding: 30,
    paddingTop: 50,
    paddingBottom: 80, // Allow for scroll buffer
  },
  dateStamp: {
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#c0a080',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    transform: [{ rotate: '5deg' }],
    marginBottom: 40,
    opacity: 0.6,
  },
  dateStampText: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c0a080',
    letterSpacing: 2,
  },
  salutation: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bodyText: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 18,
    lineHeight: 30,
    marginBottom: 30,
    opacity: 0.85,
  },
  signOff: {
    color: theme.text,
    fontFamily: 'serif',
    fontSize: 18,
    marginTop: 20,
  },
  signature: {
    fontFamily: 'cursive', // fallback for handwritten
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.leather,
    marginTop: 10,
  }
});
