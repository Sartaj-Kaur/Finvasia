import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInUp, ZoomIn, FadeOut, Layout } from 'react-native-reanimated';
import Colors from '@/constants/Colors';

const theme = Colors.light;

export default function ScanScreen() {
  const [scanState, setScanState] = useState('idle'); // idle | scanning | done

  const handleScan = () => {
    setScanState('scanning');
    // Simulate API/OCR delay
    setTimeout(() => {
      setScanState('done');
    }, 2000);
  };

  const resetScan = () => {
    setScanState('idle');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Fake Camera Viewport */}
      {scanState !== 'done' && (
        <Animated.View exiting={FadeOut} style={styles.cameraViewport}>
          {/* Viewfinder brackets */}
          <View style={[styles.bracket, styles.topLeft]} />
          <View style={[styles.bracket, styles.topRight]} />
          <View style={[styles.bracket, styles.bottomLeft]} />
          <View style={[styles.bracket, styles.bottomRight]} />

          <Text style={styles.instructionText}>
            {scanState === 'scanning' ? 'Analyzing receipt...' : 'Position receipt within frame'}
          </Text>

          <TouchableOpacity 
            style={[styles.shutterButton, scanState === 'scanning' && styles.shutterDisabled]} 
            onPress={handleScan}
            disabled={scanState === 'scanning'}
          >
            <View style={styles.shutterInner}>
              {scanState === 'scanning' && <FontAwesome name="spinner" size={24} color={theme.gold} style={styles.spinner} />}
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Post-Scan Receipt State */}
      {scanState === 'done' && (
        <Animated.View 
          entering={ZoomIn.springify()} 
          layout={Layout.springify()}
          style={styles.receiptContainer}
        >
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptStore}>ZOMATO</Text>
              <Text style={styles.receiptDate}>Today, 1:45 PM</Text>
            </View>

            <View style={styles.receiptDivider} />

            <View style={styles.receiptRow}>
               <Text style={styles.receiptItem}>Food Delivery</Text>
               <Text style={styles.receiptPrice}>₹840</Text>
            </View>

            <View style={styles.receiptDividerDashed} />

            <View style={styles.receiptRow}>
               <Text style={styles.receiptTotalLabel}>TOTAL</Text>
               <Text style={styles.receiptTotalPrice}>₹840</Text>
            </View>
            
            {/* Ragged bottom edge simulation */}
            <View style={styles.raggedEdge} />
          </View>

          <TouchableOpacity style={styles.addToBinderButton} onPress={resetScan}>
            <Text style={styles.addToBinderText}>Add to Ledger</Text>
            <FontAwesome name="check" size={16} color={theme.paper} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.discardButton} onPress={resetScan}>
            <Text style={styles.discardText}>Scan Another</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111', // Real camera bg
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  cameraViewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bracket: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  topLeft: {
    top: '15%',
    left: '10%',
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: '15%',
    right: '10%',
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: '25%',
    left: '10%',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: '25%',
    right: '10%',
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  instructionText: {
    color: '#fff',
    fontFamily: 'serif',
    fontSize: 16,
    marginBottom: 40,
  },
  shutterButton: {
    position: 'absolute',
    bottom: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  receiptContainer: {
    flex: 1,
    backgroundColor: theme.paper, // fade to desk bg
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  receiptCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 30,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 40,
    position: 'relative',
    overflow: 'visible',
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptStore: {
    fontFamily: 'Courier', // Receipt font
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#111',
  },
  receiptDate: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  receiptDividerDashed: {
    height: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    marginVertical: 15,
    borderRadius: 1,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  receiptItem: {
    fontFamily: 'Courier',
    fontSize: 16,
    color: '#111',
  },
  receiptPrice: {
    fontFamily: 'Courier',
    fontSize: 16,
    color: '#111',
  },
  receiptTotalLabel: {
    fontFamily: 'Courier',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  receiptTotalPrice: {
    fontFamily: 'Courier',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  addToBinderButton: {
    backgroundColor: theme.leather,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  addToBinderText: {
    color: theme.paper,
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  discardButton: {
    paddingVertical: 10,
  },
  discardText: {
    color: theme.tabIconDefault,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
