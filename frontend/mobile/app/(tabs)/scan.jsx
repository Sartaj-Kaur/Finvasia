import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Platform, StatusBar, ScrollView, TextInput, Alert, Image,
  Modal, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { C } from '../../constants/Theme';
import { BgShapes } from '../../components/ui/BgShapes';
import { useAuth } from '../../context/AuthContext';
import { fetchApi, uploadReceipt } from '../../utils/api';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';

// Removed mock receipts

const CATEGORIES = ['Food', 'Groceries', 'Shopping', 'Transport', 'Entertainment', 'Other'];

const ManualEntryModal = ({ visible, onClose, onSave }) => {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  const handleSave = () => {
    if (!merchant || !amount) return Alert.alert('Required', 'Please fill in merchant and amount.');
    onSave({ merchant, amount: `₹${amount}`, category, date: 'Just now', color: C.terra, id: Date.now().toString() });
    setMerchant(''); setAmount(''); setCategory('Food');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={m.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={m.scroll} keyboardShouldPersistTaps="handled">
            <View style={m.handle} />
            <View style={m.header}>
              <Text style={m.title}>Log a Receipt</Text>
              <TouchableOpacity onPress={onClose} style={m.closeBtn}>
                <Feather name="x" size={18} color={C.creamDim} />
              </TouchableOpacity>
            </View>
            <Text style={m.label}>MERCHANT</Text>
            <TextInput style={m.input} placeholder="e.g. Swiggy, Amazon..." placeholderTextColor={C.creamFaint}
              value={merchant} onChangeText={setMerchant} />
            <Text style={m.label}>AMOUNT (₹)</Text>
            <TextInput style={m.input} placeholder="0.00" placeholderTextColor={C.creamFaint}
              keyboardType="numeric" value={amount} onChangeText={setAmount} />
            <Text style={m.label}>CATEGORY</Text>
            <View style={m.chipRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={[m.chip, category === cat && m.chipActive]} onPress={() => setCategory(cat)}>
                  <Text style={[m.chipText, category === cat && m.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={m.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Feather name="check" size={18} color={C.bg} style={{ marginRight: 8 }} />
              <Text style={m.saveBtnText}>Add to Ledger</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const ReceiptItem = ({ item, index }) => (
  <Animated.View entering={FadeInDown.delay(index * 70)}>
    <View style={[s.receiptItem, index > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
      <View style={[s.receiptIcon, { backgroundColor: item.color + '20' }]}>
        <Text style={[s.receiptInitial, { color: item.color }]}>{item.merchant[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.receiptMerchant}>{item.merchant}</Text>
        <Text style={s.receiptMeta}>{item.category} · {item.date}</Text>
      </View>
      <Text style={s.receiptAmount}>{item.amount}</Text>
    </View>
  </Animated.View>
);

export default function ScanScreen() {
  const { currentUser } = useAuth();
  const [receipts, setReceipts] = useState([]);
  const [manualVisible, setManualVisible] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadTransactions = useCallback(() => {
    if (currentUser?.uid) {
        fetchApi(`/transactions/${currentUser.uid}`)
            .then(res => {
                if (res.transactions) {
                    setReceipts(res.transactions.map(t => ({
                        id: t.id,
                        merchant: t.merchant,
                        amount: `₹${t.amount}`,
                        category: t.category,
                        date: new Date(t.date).toLocaleDateString(),
                        color: t.category === 'food' ? C.terra : C.blue
                    })));
                }
            })
            .catch(e => console.error("Error loading transactions:", e));
    }
  }, [currentUser]);

  useFocusEffect(loadTransactions);

  const handleScanCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission Required', 'Please allow camera access to scan receipts.');
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4], quality: 0.8 });
    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
      setIsProcessing(true);
      try {
        const res = await uploadReceipt(currentUser.uid, result.assets[0].uri);
        Alert.alert('Receipt Detected', `Merchant: ${res.merchant}\nAmount: ₹${res.amount}\nCategory: ${res.category}`, [
            { text: 'OK' }
        ]);
        loadTransactions();
      } catch(e) {
          Alert.alert('Scan Failed', e.message);
      } finally {
          setIsProcessing(false);
          setScannedImage(null);
      }
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
      setIsProcessing(true);
      try {
        const res = await uploadReceipt(currentUser.uid, result.assets[0].uri);
        Alert.alert('Receipt Detected', `Merchant: ${res.merchant}\nAmount: ₹${res.amount}\nCategory: ${res.category}`, [
            { text: 'OK' }
        ]);
        loadTransactions();
      } catch(e) {
          Alert.alert('Scan Failed', e.message);
      } finally {
          setIsProcessing(false);
          setScannedImage(null);
      }
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <BgShapes variant="scan" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View entering={FadeInDown.delay(50)} style={{ marginBottom: 24 }}>
          <Text style={s.pageTitle}>Scanner</Text>
          <Text style={s.pageSubtitle}>Capture or log your spending</Text>
        </Animated.View>

        {scannedImage && (
          <Animated.View entering={FadeInUp} style={s.previewCard}>
            <Image source={{ uri: scannedImage }} style={s.previewImage} />
            <Text style={s.previewLabel}>Analysing receipt...</Text>
            <TouchableOpacity onPress={() => setScannedImage(null)} style={s.previewClose}>
              <Feather name="x" size={16} color={C.creamDim} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(150)} style={s.actionRow}>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.surface }]} onPress={handleScanCamera} activeOpacity={0.85}>
            <View style={[s.actionIcon, { backgroundColor: C.terra }]}>
              <Feather name="camera" size={24} color="#1C3B36" />
            </View>
            <Text style={s.actionBtnTitle}>Scan Receipt</Text>
            <Text style={s.actionBtnSub}>Use your camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.actionBtn, { backgroundColor: C.surface }]} onPress={() => setManualVisible(true)} activeOpacity={0.85}>
            <View style={[s.actionIcon, { backgroundColor: C.sand }]}>
              <Feather name="edit-2" size={22} color="#1C3B36" />
            </View>
            <Text style={s.actionBtnTitle}>Enter Manually</Text>
            <Text style={s.actionBtnSub}>Type it in</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <TouchableOpacity style={s.galleryBtn} onPress={handleGallery} activeOpacity={0.8}>
            <Feather name="image" size={16} color={C.creamDim} style={{ marginRight: 10 }} />
            <Text style={s.galleryBtnText}>Upload from Gallery</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={s.sectionHeaderRow}>
            <Text style={s.sectionTitle}>Recent Receipts</Text>
            <View style={s.badge}><Text style={s.badgeText}>{receipts.length} entries</Text></View>
          </View>
          <View style={s.receiptList}>
            {receipts.map((item, index) => <ReceiptItem key={item.id} item={item} index={index} />)}
          </View>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>
      <ManualEntryModal visible={manualVisible} onClose={() => setManualVisible(false)}
        onSave={async (entry) => {
            if (currentUser?.uid) {
                try {
                    await fetchApi('/transactions/', {
                        method: 'POST',
                        body: JSON.stringify({
                            user_id: currentUser.uid,
                            amount: parseFloat(String(entry.amount).replace(/[^0-9.]/g, '')),
                            merchant: entry.merchant
                        })
                    });
                    loadTransactions();
                } catch(e) {
                    console.error(e);
                }
            }
        }} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 160 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: C.cream, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: C.creamDim, marginTop: 4, fontWeight: '500' },
  previewCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 20, backgroundColor: C.surface, position: 'relative' },
  previewImage: { width: '100%', height: 200 },
  previewLabel: { textAlign: 'center', padding: 16, color: C.cream, fontWeight: '700', fontSize: 14 },
  previewClose: { position: 'absolute', top: 12, right: 12, backgroundColor: '#FFFFFF', borderRadius: 18, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  actionBtn: {
    flex: 1, borderRadius: 24, padding: 20, alignItems: 'center',
  },
  actionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  actionBtnTitle: { fontSize: 15, fontWeight: '800', color: C.cream, marginBottom: 4 },
  actionBtnSub: { fontSize: 13, color: C.creamDim, fontWeight: '500' },
  galleryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface,
    borderRadius: 20, paddingVertical: 18, marginBottom: 32,
  },
  galleryBtnText: { fontSize: 15, fontWeight: '700', color: C.cream, marginLeft: 8 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.cream, letterSpacing: -0.3 },
  badge: { backgroundColor: C.green, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, color: '#1A3631', fontWeight: '800' },
  receiptList: {
    backgroundColor: C.surface, borderRadius: 24, overflow: 'hidden',
  },
  receiptItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#FFFFFF' },
  receiptIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  receiptInitial: { fontSize: 18, fontWeight: '800', color: '#1A3631' },
  receiptMerchant: { fontSize: 16, fontWeight: '800', color: C.cream, marginBottom: 4 },
  receiptMeta: { fontSize: 12, color: C.creamFaint },
  receiptAmount: { fontSize: 15, fontWeight: '800', color: C.cream },
});

const m = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24 },
  handle: { width: 48, height: 6, backgroundColor: C.creamFaint, borderRadius: 4, alignSelf: 'center', marginBottom: 24, opacity: 0.5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '800', color: C.cream },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700', color: C.creamDim, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: C.surface, borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 18, fontSize: 18, color: C.cream, marginBottom: 24, fontWeight: '600'
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  chip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 24, backgroundColor: C.surface },
  chipActive: { backgroundColor: C.green },
  chipText: { fontSize: 14, fontWeight: '700', color: C.creamDim },
  chipTextActive: { color: '#1A3631' },
  saveBtn: {
    flexDirection: 'row', backgroundColor: C.surfaceHigh, borderRadius: 24, paddingVertical: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
