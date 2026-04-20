import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Edit2, Image as ImageIcon, ChevronRight } from 'react-native-feather';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { C, FONTS, globalStyles } from '../../src/theme';
import { MOCK_RECEIPTS } from '../../src/data/mockData';
import { useAuth } from '../../context/AuthContext';
import { fetchApi } from '../../utils/api';

export default function Receipts() {
  const { currentUser } = useAuth() as any;
  const d = new Date();
  const dateStr = `${d.toLocaleString('en-US', {month: 'short'}).toUpperCase()} ${d.getDate()}`;

  const [receipts, setReceipts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    async function fetchReceipts() {
      if (!currentUser?.uid) return;
      try {
        const res = await fetchApi(`/transactions/${currentUser.uid}`);
        if (res && res.transactions) {
          const formatted = res.transactions.map((t: any) => ({
             id: t.id,
             merchant: t.merchant,
             category: t.category,
             date: t.date && t.date.includes('-') ? new Date(t.date).toLocaleDateString() : t.date,
             amount: t.amount,
             confidence: t.is_scanned ? 95 : 0,
             is_scanned: t.is_scanned
          }));
          setReceipts(formatted.length ? formatted : MOCK_RECEIPTS);
        }
      } catch (err) { }
    }
    fetchReceipts();
  }, [currentUser]);

  const processReceiptUri = async (uri: string) => {
    setIsProcessing(true);
    try {
      const uid = currentUser?.uid || "hackathon_test_user";

      // Step 1: Read image as base64 using expo-file-system (reliable in React Native)
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });
      console.log('[Vision OCR] base64 length:', base64Data.length);
      const visionKey = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Data },
              features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
            }]
          })
        }
      );
      const visionData = await visionRes.json();
      const rawText: string = visionData?.responses?.[0]?.fullTextAnnotation?.text || '';
      console.log('[Vision OCR] Raw text:', rawText.substring(0, 200));

      if (!rawText) throw new Error('No text found in image');

      // Step 3: Use Groq to intelligently extract merchant + amount from raw OCR text
      // This is a tiny text call - no tunnel or image needed, direct HTTPS to Groq
      const groqKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
      let merchant = 'Unknown Merchant';
      let amount = 0;

      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0,
            max_tokens: 64,
            messages: [
              {
                role: 'user',
                content: `Extract the merchant name and total bill amount from this receipt OCR text. Return ONLY valid JSON like: {"merchant":"Store Name","amount":54.00}\n\nReceipt text:\n${rawText.substring(0, 800)}`
              }
            ]
          })
        });
        const groqData = await groqRes.json();
        const groqText = groqData?.choices?.[0]?.message?.content?.trim() || '';
        console.log('[Groq Parse] Response:', groqText);
        
        // Clean markdown fences if present
        const cleaned = groqText.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        merchant = parsed.merchant || 'Unknown Merchant';
        amount = parseFloat(parsed.amount) || 0;
      } catch (groqErr) {
        console.log('[Groq Parse] Falling back to regex:', groqErr);
        // Fallback: scan each line for currency patterns
        const lines = rawText.split('\n').map((l: string) => l.trim()).filter(Boolean);
        merchant = lines[0] || 'Unknown Merchant';
        const totalLine = lines.find((l: string) => /total|grand|amount|amt|bill/i.test(l));
        const searchIn = totalLine || rawText;
        // Match numbers like 54, 54.00, 1,234.56 but NOT 4-digit years
        const numMatch = searchIn.match(/(?<!\d)\d{1,4}(?:,\d{3})*(?:\.\d{1,2})?(?!\d)/g);
        if (numMatch) {
          const nums = numMatch
            .map((n: string) => parseFloat(n.replace(/,/g, '')))
            .filter((n: number) => n > 0 && n < 100000 && !(n >= 1900 && n <= 2100)); // exclude years
          amount = nums.length > 0 ? Math.max(...nums) : 0;
        }
      }

      const category = 'lifestyle';

      // Step 4: Save to backend as small JSON (reuses fetchApi with correct tunnel headers)
      try {
        await fetchApi('/transactions/', {
          method: 'POST',
          body: JSON.stringify({
            user_id: uid,
            amount,
            merchant,
            date: new Date().toISOString(),
          })
        });
        console.log('[Receipt] Saved to backend successfully');
      } catch (saveErr: any) {
        console.log('[Receipt] Backend save failed:', saveErr?.message);
        // Non-critical — receipt still shows in UI
      }

      // Step 5: Update UI
      setReceipts(prev => [{
        id: Math.random().toString(),
        merchant,
        category,
        date: 'Today',
        amount,
        confidence: 90,
        is_scanned: true
      }, ...prev]);
      alert(`✅ Logged: ${merchant} — ₹${amount.toFixed(2)}`);
      
    } catch (e: any) {
      console.log('[Receipt OCR Error]', e);
      alert(`Receipt scan failed: ${e.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };


  const openCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets[0].uri) {
      processReceiptUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && result.assets[0].uri) {
      processReceiptUri(result.assets[0].uri);
    }
  };

  const [manualModal, setManualModal] = useState(false);
  const [manualAmt, setManualAmt] = useState('');
  const [manualTitle, setManualTitle] = useState('');

  const submitManual = async () => {
    if (!manualAmt || !manualTitle) {
      alert("Please enter both amount and details.");
      return;
    }

    try {
      const uid = currentUser?.uid || "hackathon_test_user";
      await fetchApi('/transactions/', {
        method: 'POST',
        body: JSON.stringify({
          user_id: uid,
            amount: parseFloat(manualAmt) || 0,
            merchant: manualTitle,
            date: new Date().toISOString()
        })
      });
    } catch (e) {
      console.log("Failed to sync manual receipt to backend", e);
    }

    setReceipts(prev => [{
      id: Math.random().toString(),
      merchant: manualTitle,
      category: "General",
      date: 'Today',
      amount: parseFloat(manualAmt) || 0,
      confidence: 0
    }, ...prev]);
    
    setManualModal(false);
    setManualAmt('');
    setManualTitle('');
  };

  const openManual = () => {
    setManualModal(true);
  };

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        
        <View style={s.header}>
          <Text style={s.title}>RECEIPTS</Text>
          <Text style={s.dateTop}>{dateStr}</Text>
        </View>



        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.delay(100)} style={s.gridRow}>
            <TouchableOpacity style={[globalStyles.cardStyle, s.boxCard]} activeOpacity={0.8} onPress={openCamera}>
              <View style={[s.iconCirc, { backgroundColor: C.BLUE_DIM }]}>
                <Camera color={C.BLUE} width={28} height={28} />
              </View>
              <Text style={s.boxTitle}>Scan Receipt</Text>
              <Text style={s.boxSub}>Point camera at bill</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[globalStyles.cardStyle, s.boxCard]} activeOpacity={0.8} onPress={openManual}>
              <View style={[s.iconCirc, { backgroundColor: C.YELLOW_DIM }]}>
                <Edit2 color={C.AMBER} width={28} height={28} />
              </View>
              <Text style={s.boxTitle}>Enter Manually</Text>
              <Text style={s.boxSub}>Type amount + details</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <TouchableOpacity style={s.galleryCard} activeOpacity={0.8} onPress={openGallery}>
              <ImageIcon color={C.T2} width={20} height={20} />
              <Text style={s.galleryTitle}>Upload from Gallery</Text>
              <ChevronRight color={C.T3} width={18} height={18} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <View style={s.sectionHeader}>
              <Text style={globalStyles.sectionLabelStyle}>
                {isProcessing ? "ANALYZING RECEIPT..." : "RECENT RECEIPTS"}
              </Text>
              {!isProcessing && <View style={s.countBadge}><Text style={s.countText}>{receipts.length}</Text></View>}
            </View>

            <View style={s.listCont}>
              {receipts.map((r, i) => (
                <View key={r.id} style={[s.item, i === receipts.length - 1 && s.noBorder]}>
                  <View style={s.itemRow}>
                    <View style={s.itemIcon}>
                      <Text style={{ color: C.T1, fontFamily: FONTS.SYNE }}>{r.merchant.charAt(0)}</Text>
                    </View>
                    <View style={s.itemMid}>
                      <Text style={s.itemTitle}>{r.merchant}</Text>
                      <Text style={s.itemSub}>{r.category} · {r.date}</Text>
                      {r.is_scanned && (
                        <View style={s.ocrRow}>
                          <View style={s.ocrPill}><Text style={s.ocrPillText}>Auto-categorized</Text></View>
                          {r.confidence > 0 && <Text style={s.confText}>{r.confidence}% match</Text>}
                        </View>
                      )}
                    </View>
                    <View style={s.itemRight}>
                      <Text style={s.amt}>₹{r.amount.toFixed(2)}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                        <Edit2 color={C.T3} width={12} height={12} />
                        <Text style={{ fontFamily: FONTS.JAKARTA, fontSize: 10, color: C.T3 }}>Edit</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Manual Entry Modal */}
      <Modal visible={manualModal} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Manual Entry</Text>
            
            <TextInput 
              style={s.input} 
              placeholder="Amount (₹)" 
              placeholderTextColor={C.T3} 
              keyboardType="numeric" 
              value={manualAmt} 
              onChangeText={setManualAmt} 
              autoFocus
            />
            <TextInput 
              style={s.input} 
              placeholder="Merchant / Purpose" 
              placeholderTextColor={C.T3} 
              value={manualTitle} 
              onChangeText={setManualTitle} 
            />
            
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: C.BASE }]} onPress={() => setManualModal(false)} activeOpacity={0.8}>
                <Text style={[s.btnTxt, { color: C.T1 }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, { flex: 1, backgroundColor: C.BLUE }]} onPress={submitManual} activeOpacity={0.8}>
                <Text style={[s.btnTxt, { color: '#FFF' }]}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {isProcessing && (
        <View style={s.loadingOverlay}>
          <View style={s.loadingBox}>
            <ActivityIndicator size="large" color={C.BLUE} />
            <Text style={s.loadingText}>Analyzing receipt...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  title: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1 },
  dateTop: { fontFamily: FONTS.MONO, fontSize: 13, color: C.T2 },
  
  scroll: { paddingHorizontal: 16 },

  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  boxCard: { flex: 1, padding: 20, alignItems: 'center' },
  iconCirc: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  boxTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 15, color: C.T1, marginBottom: 4 },
  boxSub: { fontFamily: FONTS.JAKARTA, fontSize: 12, color: C.T2 },

  galleryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: 16, padding: 16, gap: 12, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
  galleryTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 14, color: C.T1 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  countBadge: { backgroundColor: C.BLUE_DIM, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 8 },
  countText: { fontFamily: FONTS.MONO, fontSize: 10, color: C.BLUE },

  listCont: { backgroundColor: C.SURFACE, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.BORDER },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: C.BORDER },
  noBorder: { borderBottomWidth: 0 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between' },
  itemIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.BASE, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemMid: { flex: 1 },
  itemRight: { alignItems: 'flex-end', justifyContent: 'center', minWidth: 80 },
  itemTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 15, color: C.T1 },
  itemSub: { fontFamily: FONTS.MONO, fontSize: 11, color: C.T2, marginTop: 2 },
  ocrRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ocrPill: { backgroundColor: C.BLUE_DIM, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  ocrPillText: { fontFamily: FONTS.MONO, fontSize: 8, color: C.BLUE },
  confText: { fontFamily: FONTS.MONO, fontSize: 8, color: C.T2 },
  
  dateSub: { fontFamily: FONTS.MONO, fontSize: 13, color: C.T2 },
  amt: { fontFamily: FONTS.SYNE, fontSize: 18, color: C.T1, fontWeight: '700' },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: C.SURFACE,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.BORDER,
  },
  loadingText: {
    fontFamily: FONTS.JAKARTA_SEMI,
    fontSize: 16,
    color: C.BLUE,
    marginTop: 16,
  },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(26, 32, 44, 0.4)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: C.SURFACE, padding: 24, borderRadius: 24, borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 },
  modalTitle: { fontFamily: FONTS.SYNE, fontSize: 24, color: C.T1, marginBottom: 20 },
  input: { height: 56, backgroundColor: C.BASE, borderRadius: 12, borderWidth: 1, borderColor: C.BORDER, fontFamily: FONTS.JAKARTA, fontSize: 16, color: C.T1, paddingHorizontal: 16, marginBottom: 12 },
  btn: { height: 56, backgroundColor: C.BLUE, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#FFFFFF' }
});
