import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  Platform, StatusBar, ScrollView, TextInput, Alert, Image,
  Modal, KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { C } from '../../constants/Theme';

const MOCK_RECEIPTS = [
  { id: '1', merchant: 'Swiggy', amount: '₹342', category: 'Food', date: 'Today, 1:20 PM', color: C.terra },
  { id: '2', merchant: 'Blinkit', amount: '₹189', category: 'Groceries', date: 'Yesterday, 6:45 PM', color: C.green },
  { id: '3', merchant: 'Zomato', amount: '₹560', category: 'Food', date: 'Apr 11, 8:10 PM', color: C.red },
  { id: '4', merchant: 'Amazon', amount: '₹1,299', category: 'Shopping', date: 'Apr 10, 2:30 PM', color: C.blue },
  { id: '5', merchant: 'Netflix', amount: '₹649', category: 'Entertainment', date: 'Apr 9', color: C.sand },
];

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
                <FontAwesome name="times" size={18} color={C.creamDim} />
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
              <FontAwesome name="check" size={16} color={C.bg} style={{ marginRight: 8 }} />
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
  const [receipts, setReceipts] = useState(MOCK_RECEIPTS);
  const [manualVisible, setManualVisible] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);

  const handleScanCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission Required', 'Please allow camera access to scan receipts.');
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4], quality: 0.8 });
    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
      setTimeout(() => Alert.alert('Receipt Detected', 'Merchant: Swiggy\nAmount: ₹342\n\nAdd to ledger?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => {
          setReceipts(prev => [{ id: Date.now().toString(), merchant: 'Swiggy', amount: '₹342', category: 'Food', date: 'Just now', color: C.terra }, ...prev]);
          setScannedImage(null);
        }},
      ]), 800);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
    if (!result.canceled) {
      setScannedImage(result.assets[0].uri);
      setTimeout(() => Alert.alert('Receipt Detected', 'Merchant: Amazon\nAmount: ₹1,299\n\nAdd to ledger?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: () => {
          setReceipts(prev => [{ id: Date.now().toString(), merchant: 'Amazon', amount: '₹1,299', category: 'Shopping', date: 'Just now', color: C.blue }, ...prev]);
          setScannedImage(null);
        }},
      ]), 600);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
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
              <FontAwesome name="times" size={14} color={C.creamDim} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(150)} style={s.actionRow}>
          <TouchableOpacity style={s.actionBtn} onPress={handleScanCamera} activeOpacity={0.85}>
            <View style={[s.actionIcon, { backgroundColor: C.terra + '28' }]}>
              <FontAwesome name="camera" size={24} color={C.terra} />
            </View>
            <Text style={s.actionBtnTitle}>Scan Receipt</Text>
            <Text style={s.actionBtnSub}>Use your camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.actionBtn} onPress={() => setManualVisible(true)} activeOpacity={0.85}>
            <View style={[s.actionIcon, { backgroundColor: C.blue + '20' }]}>
              <FontAwesome name="pencil" size={22} color={C.blue} />
            </View>
            <Text style={s.actionBtnTitle}>Enter Manually</Text>
            <Text style={s.actionBtnSub}>Type it in</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <TouchableOpacity style={s.galleryBtn} onPress={handleGallery} activeOpacity={0.8}>
            <FontAwesome name="image" size={15} color={C.creamDim} style={{ marginRight: 10 }} />
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
        onSave={(entry) => setReceipts(prev => [entry, ...prev])} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  pageTitle: { fontSize: 28, fontWeight: '700', color: C.cream, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, color: C.creamDim, marginTop: 2 },
  previewCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: C.border, position: 'relative' },
  previewImage: { width: '100%', height: 200 },
  previewLabel: { textAlign: 'center', padding: 10, backgroundColor: C.surface, color: C.sand, fontWeight: '600', fontSize: 13 },
  previewClose: { position: 'absolute', top: 10, right: 10, backgroundColor: C.surfaceHigh, borderRadius: 15, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  actionBtn: {
    flex: 1, backgroundColor: C.surface, borderRadius: 20, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionBtnTitle: { fontSize: 14, fontWeight: '700', color: C.cream, marginBottom: 4 },
  actionBtnSub: { fontSize: 12, color: C.creamFaint },
  galleryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface,
    borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingVertical: 13, marginBottom: 28,
  },
  galleryBtnText: { fontSize: 14, fontWeight: '600', color: C.creamDim },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: C.creamDim, textTransform: 'uppercase', letterSpacing: 1.5 },
  badge: { backgroundColor: C.sand + '30', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 12, color: C.sand, fontWeight: '600' },
  receiptList: {
    backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
  },
  receiptItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  receiptIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  receiptInitial: { fontSize: 18, fontWeight: '800' },
  receiptMerchant: { fontSize: 15, fontWeight: '700', color: C.cream, marginBottom: 3 },
  receiptMeta: { fontSize: 12, color: C.creamFaint },
  receiptAmount: { fontSize: 15, fontWeight: '800', color: C.cream },
});

const m = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24 },
  handle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 22, fontWeight: '700', color: C.cream },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '700', color: C.creamDim, letterSpacing: 1.5, marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: C.cream, marginBottom: 22,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.terra, borderColor: C.terra },
  chipText: { fontSize: 13, fontWeight: '600', color: C.creamDim },
  chipTextActive: { color: C.cream },
  saveBtn: {
    flexDirection: 'row', backgroundColor: C.terra, borderRadius: 16, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', shadowColor: C.terra, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
  },
  saveBtnText: { color: C.cream, fontSize: 16, fontWeight: '700' },
});
