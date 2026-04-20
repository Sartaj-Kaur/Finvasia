import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, AppState, Alert } from 'react-native';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring, FadeInUp, FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Mic, UploadCloud, X, ShoppingCart } from 'react-native-feather';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, FONTS, globalStyles } from '../theme';
import { MOCK_USER, MOCK_BUDGETS } from '../data/mockData';
// Service Imports
import { analyzeReceiptImage } from '../services/ocr';
import { analyzeScreenContext } from '../services/analyzer';
import { speakAnalysis } from '../services/tts';
import { transcribeAudio } from '../services/stt';

type OverlayState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ANALYZING' | 'RESULT';

export default function HeyMonagerOverlay() {
  const [openMenu, setOpenMenu] = useState(false);
  const [state, setState] = useState<OverlayState>('IDLE');
  
  const [agent, setAgent] = useState('VOLT');
  const [transcript, setTranscript] = useState('');
  const [analysisStr, setAnalysisStr] = useState('');
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  
  // Dynamic thumb data
  const [thumbData, setThumbData] = useState({ merchant: 'Zomato', amount: 850, category: 'Food & Dining' });

  const pulseAnim = useSharedValue(1);
  const appState = useRef(AppState.currentState);
  const pendingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeRecording = useRef<Audio.Recording | null>(null);
  // Wake-word detection
  const isAmbientListening = useRef(false);
  const isActiveRef = useRef(false); // mirrors state !== 'IDLE' without stale closures
  const [wakeWordActive, setWakeWordActive] = useState(false); // UI indicator

  const cancelPending = () => {
    pendingTimers.current.forEach(clearTimeout);
    pendingTimers.current = [];
  };

  useEffect(() => {
    // Pulse animation for the floating button
    pulseAnim.value = withRepeat(withTiming(1.3, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false);
    AsyncStorage.getItem('monager_user_agent').then(a => a && setAgent(a));
    // Start wake-word background listener
    startAmbientListening();
    return () => { isAmbientListening.current = false; };
  }, []);

  // Keep isActiveRef in sync with state so the ambient loop can read it without stale closure
  useEffect(() => {
    isActiveRef.current = state !== 'IDLE';
  }, [state]);

  /** Tiny sleep helper for the ambient loop */
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  /**
   * Background wake-word loop.
   * Records 2.5-second chunks → Groq Whisper → checks for "hey monager".
   * Pauses automatically while the overlay is already active.
   */
  const startAmbientListening = async () => {
    if (isAmbientListening.current) return;
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) { console.warn('[WakeWord] mic permission denied'); return; }
    isAmbientListening.current = true;
    setWakeWordActive(true);
    console.log('[WakeWord] 🟢 Loop started');

    while (isAmbientListening.current) {
      // Pause loop while overlay is already showing
      if (isActiveRef.current) {
        await sleep(1000);
        continue;
      }

      let chunk: Audio.Recording | null = null;
      let peakLevel = -160; // dBFS — tracks loudest moment in the chunk
      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(
          {
            android: {
              extension: '.m4a',
              outputFormat: Audio.AndroidOutputFormat.MPEG_4,
              audioEncoder: Audio.AndroidAudioEncoder.AAC,
              sampleRate: 16000,
              numberOfChannels: 1,
              bitRate: 32000,
            },
            ios: {
              extension: '.m4a',
              outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
              audioQuality: Audio.IOSAudioQuality.LOW,
              sampleRate: 16000,
              numberOfChannels: 1,
              bitRate: 32000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
            web: {},
            isMeteringEnabled: true,
          },
          (status) => {
            // Track peak level so we can skip Whisper on silent chunks
            if (status.metering !== undefined && status.metering > peakLevel) {
              peakLevel = status.metering;
            }
          },
          100 // metering update interval ms
        );
        chunk = recording;

        await sleep(5000); // 5s listen window

        await chunk.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = chunk.getURI();
        chunk = null;

        // Skip Whisper entirely if no sound was loud enough to be speech
        // -35 dBFS threshold: silence / background noise is typically below -40
        if (peakLevel < -35) {
          console.log('[WakeWord] 🔇 Silent chunk, skipping Whisper');
          await sleep(1000); // cooldown gap
          continue;
        }

        if (!uri || !isAmbientListening.current || isActiveRef.current) { await sleep(1000); continue; }

        const text = await transcribeAudio(uri);
        console.log(`[WakeWord] heard (peak ${peakLevel.toFixed(1)}dBFS):`, text);
        if (!isAmbientListening.current || isActiveRef.current) continue;

        const lower = text.toLowerCase().replace(/[^a-z\s]/g, '');
        // Broad matching — Whisper may transcribe "monager" as "manager", "monagr", etc.
        if (
          lower.includes('hey monager') ||
          lower.includes('hey manager') ||
          lower.includes('monager') ||
          lower.includes('hey manage') ||
          lower.includes('hey mono') ||
          (lower.includes('hey') && lower.includes('mona'))
        ) {
          console.log('[WakeWord] ✅ Wake word detected! Activating...');
          // STOP the ambient loop FIRST — only one Recording can exist at a time
          isAmbientListening.current = false;
          setWakeWordActive(false);
          // Give expo-av time to fully release the audio session
          await sleep(500);
          await startListening();
          break; // exit the while loop cleanly
        }

        await sleep(1000); // 1s cooldown between chunks
      } catch (e) {
        if (chunk) {
          try { await chunk.stopAndUnloadAsync(); } catch {}
          chunk = null;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false }).catch(() => {});
        console.warn('[WakeWord] chunk error, backing off:', e);
        await sleep(3000);
      }
    }
    setWakeWordActive(false);
    console.log('[WakeWord] 🔴 Loop exited');
  };

  const startListening = async () => {
    cancelPending();
    setOpenMenu(false);
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Microphone Access Needed', 'Allow microphone access so Hey Monager can hear you.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      activeRecording.current = recording;
      setState('LISTENING');
    } catch (e) {
      console.error('[HeyMonager] Failed to start recording:', e);
    }
  };

  const stopListening = async () => {
    const recording = activeRecording.current;
    if (!recording) return;
    try {
      setState('ANALYZING');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      activeRecording.current = null;
      const uri = recording.getURI();
      if (!uri) {
        const fallback = 'How is my spending looking?';
        setTranscript(fallback);
        runAnalysis(fallback, null);
        return;
      }
      const text = await transcribeAudio(uri);
      const finalText = text.trim() || 'How is my spending looking?';
      setTranscript(finalText);
      runAnalysis(finalText, null);
    } catch (e) {
      console.error('[HeyMonager] Failed to stop/transcribe recording:', e);
      activeRecording.current = null;
    }
  };

  const runAnalysis = async (userTranscript: string, visionData: any | null) => {
    try {
      const userContext = {
        agent,
        name: MOCK_USER.name,
        income: MOCK_USER.income,
        daysLeft: MOCK_USER.daysLeft,
        topPattern: MOCK_USER.topPattern,
        budgets: MOCK_BUDGETS,
        spending: {
          total: Object.values(MOCK_BUDGETS).reduce((sum, b) => sum + b.spent, 0),
        },
      };
      const response = await analyzeScreenContext(userTranscript, visionData, userContext);
      setAnalysisStr(response);
      setState('RESULT');
      speakAnalysis(response, agent);
    } catch (e) {
      console.error('[HeyMonager] analyzeScreenContext failed:', e);
      const errStr = "Couldn't reach the analysis engine right now. Try again?";
      setAnalysisStr(errStr);
      setState('RESULT');
      speakAnalysis(errStr, agent);
    }
  };

  const startUpload = async () => {
    cancelPending();
    setOpenMenu(false);
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], base64: true });
    
    if (!result.canceled && result.assets[0]) {
      setScreenshotUri(result.assets[0].uri);
      startProcessingScreenshot(result.assets[0].uri, "Analyze this screenshot I uploaded.", result.assets[0].base64);
    }
  };

  const startProcessingScreenshot = async (uri: string, tText: string, b64?: string | null) => {
    setTranscript(tText);
    setState('PROCESSING');
    
    let visionData: any = null;
    try {
      if (b64) {
        const data = await analyzeReceiptImage(b64);
        if (data && data.merchant) {
           setThumbData({ merchant: data.merchant, amount: data.amount, category: data.category });
           visionData = data;
        }
      }
    } catch (e) {
      console.log('Vision pipeline fail in Assistant', e);
    }

    setState('ANALYZING');
    // Pass OCR result (or null) into the LLM for a dynamic, contextual response
    await runAnalysis(tText, visionData);
  };

  const closeOverlay = () => {
    cancelPending();
    if (activeRecording.current) {
      activeRecording.current.stopAndUnloadAsync().catch(() => {});
      activeRecording.current = null;
      Audio.setAudioModeAsync({ allowsRecordingIOS: false }).catch(() => {});
    }
    setState('IDLE');
    setScreenshotUri(null);
    setTranscript('');
    setAnalysisStr('');
    // Restart wake-word listener after overlay closes
    setTimeout(() => startAmbientListening(), 1000);
  };

  /* ----- Animations ----- */
  const floatBtnStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseAnim.value }], opacity: 2 - pulseAnim.value }));
  const menuStyle = useAnimatedStyle(() => ({ transform: [{ scale: withSpring(openMenu ? 1 : 0.8) }], opacity: withTiming(openMenu ? 1 : 0), pointerEvents: openMenu ? 'auto' : 'none' }));

  return (
    <>
      {/* Dim Background for quick menu */}
      {openMenu && <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setOpenMenu(false)} />}

      {/* Floating Quick Menu */}
      <Animated.View style={[s.menu, menuStyle]}>
        <TouchableOpacity style={s.menuItem} onPress={startListening}>
          <Mic color={C.BLUE} width={16} style={{ marginRight: 10 }} />
          <Text style={s.menuText}>Hey Monager</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.menuItem} onPress={startUpload}>
          <UploadCloud color={C.T2} width={16} style={{ marginRight: 10 }} />
          <Text style={s.menuText}>Upload Screenshot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.menuItem, { borderBottomWidth: 0 }]}>
          <ShoppingCart color={C.T2} width={16} style={{ marginRight: 10 }} />
          <Text style={s.menuText}>Analyze Cart</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Floating M Button */}
      <View style={s.wrapper}>
        <Animated.View style={[s.ring, floatBtnStyle]} />
        {/* Green dot = wake word listener is active */}
        {wakeWordActive && <View style={s.wakeIndicator} />}
        <TouchableOpacity style={[s.button, { backgroundColor: C.BLUE }]} activeOpacity={0.8} onPress={() => setOpenMenu(!openMenu)} onLongPress={startListening}>
          <Text style={s.btnText}>M</Text>
        </TouchableOpacity>
      </View>

      {/* Main Overlay Modal */}
      <Modal visible={state !== 'IDLE'} transparent animationType={state === 'RESULT' ? 'slide' : 'fade'}>
        <View style={s.modalOverlay}>
          
          {/* LISTENING / PROCESSING / ANALYZING states */}
          {(state === 'LISTENING' || state === 'PROCESSING' || state === 'ANALYZING') && (
            <View style={s.centerOverlay}>
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
              {state === 'LISTENING' && (
                <>
                  <Text style={[s.agentTitle, { color: C.BLUE }]}>[{agent}]</Text>
                  <Text style={s.bigTitle}>Listening...</Text>
                  <TouchableOpacity style={s.orbPulse} onPress={stopListening} activeOpacity={0.7}>
                    <View style={[s.orb, { backgroundColor: C.BLUE, shadowColor: C.BLUE }]} />
                    <Text style={[s.hint, { position: 'absolute', bottom: -4 }]}>Tap to send</Text>
                  </TouchableOpacity>
                  <Text style={s.hint}>Speak in Hindi or English</Text>
                </>
              )}

              {state === 'PROCESSING' && (
                <>
                  {screenshotUri && <Image source={{ uri: screenshotUri }} style={s.processImg} />}
                  <Text style={[s.bigTitle, { marginTop: 20 }]}>Analyzing screen...</Text>
                  <Text style={s.hint}>Google Vision extracting data</Text>
                </>
              )}

              {state === 'ANALYZING' && (
                <>
                  <Text style={[s.agentTitle, { color: C.BLUE }]}>[{agent}]</Text>
                  <Text style={[s.bigTitle, { marginTop: 20 }]}>Thinking...</Text>
                </>
              )}
              
              <TouchableOpacity style={s.closeCirc} onPress={closeOverlay}>
                <X color={C.T1} width={24} />
              </TouchableOpacity>
            </View>
          )}

          {/* RESULT state bottom sheet */}
          {state === 'RESULT' && (
            <Animated.View entering={FadeInUp} style={s.resultSheet}>
              <View style={s.sheetHandle} />
              
              <View style={s.sheetHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={s.sheetAgnIcon}><Text style={s.sheetAgnInit}>{agent.charAt(0)}</Text></View>
                  <Text style={s.sheetTitle}>{agent}'S ANALYSIS</Text>
                </View>
                <TouchableOpacity onPress={closeOverlay}><X color={C.T3} /></TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={s.transcriptCard}>
                  <Text style={s.lblSmall}>YOU SAID</Text>
                  <Text style={s.transcriptTxt}>"{transcript}"</Text>
                </View>

                {screenshotUri && (
                  <View style={s.thumbCard}>
                    <Image source={{ uri: screenshotUri }} style={s.thumbImg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={s.thumbTitle}>Detected: {thumbData.merchant} · ₹{thumbData.amount} match</Text>
                      <Text style={s.thumbSub}>Category: {thumbData.category}</Text>
                    </View>
                  </View>
                )}

                <View style={{ paddingHorizontal: 20 }}>
                  <View style={s.analysisCard}>
                    <Text style={s.analysisLbl}>[{agent}]</Text>
                    <Text style={s.analysisTxt}>{analysisStr}</Text>
                  </View>
                  
                  <View style={s.contextRow}>
                    <Text style={s.contextLbl}>Food: 77% → 88% after this</Text>
                    <View style={s.contextBar}>
                      <View style={[s.contextFill, { width: '77%', backgroundColor: C.AMBER }]} />
                      <View style={[s.contextFill, { position: 'absolute', left: '77%', width: '11%', backgroundColor: C.RED, opacity: 0.5 }]} />
                    </View>
                  </View>
                </View>

                <View style={s.actions}>
                  <TouchableOpacity style={s.primaryBtn} onPress={closeOverlay}>
                    <Text style={s.primaryBtnTxt}>Open jUMPP →</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.outlineBtn} onPress={closeOverlay}>
                    <Text style={s.outlineBtnTxt}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>
            </Animated.View>
          )}

        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  ring: { position: 'absolute', width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, borderColor: C.BLUE_DIM },
  button: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  btnText: { fontFamily: FONTS.SYNE, color: '#FFF', fontSize: 20 },
  wakeIndicator: { position: 'absolute', top: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: C.BLUE, borderWidth: 2, borderColor: C.BASE, zIndex: 10000 },
  
  menu: { position: 'absolute', bottom: 160, right: 20, width: 220, backgroundColor: C.SURFACE, borderRadius: 16, borderWidth: 1, borderColor: C.BORDER, padding: 8, zIndex: 9998, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: C.BORDER },
  menuText: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.4)', justifyContent: 'flex-end' },
  
  centerOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  agentTitle: { fontFamily: FONTS.SYNE, fontSize: 24, marginBottom: 16 },
  bigTitle: { fontFamily: FONTS.SYNE, fontSize: 28, color: C.T1 },
  hint: { fontFamily: FONTS.MONO, fontSize: 11, color: C.T2, marginTop: 12 },
  orbPulse: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginVertical: 40 },
  orb: { width: 80, height: 80, borderRadius: 40, shadowOpacity: 0.5, shadowRadius: 20 },
  processImg: { width: 200, height: 400, borderRadius: 16, borderWidth: 2, borderColor: C.BORDER, resizeMode: 'cover' },
  closeCirc: { position: 'absolute', bottom: 60, width: 44, height: 44, borderRadius: 22, backgroundColor: C.SURFACE, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.BORDER },

  resultSheet: { backgroundColor: C.SURFACE, height: '75%', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 15 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.BORDER, alignSelf: 'center', marginTop: 12 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingBottom: 10, alignItems: 'center' },
  sheetAgnIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.YELLOW, alignItems: 'center', justifyContent: 'center' },
  sheetAgnInit: { fontFamily: FONTS.SYNE, fontSize: 16, color: C.T1 },
  sheetTitle: { fontFamily: FONTS.SYNE, fontSize: 18, color: C.T1 },

  transcriptCard: { margin: 16, backgroundColor: C.BASE, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.BORDER },
  lblSmall: { fontFamily: FONTS.MONO, fontSize: 9, color: C.T2, marginBottom: 6 },
  transcriptTxt: { fontFamily: FONTS.JAKARTA, fontSize: 14, color: C.T1, fontStyle: 'italic' },

  thumbCard: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: C.BASE, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: C.BORDER, alignItems: 'center' },
  thumbImg: { width: 48, height: 48, borderRadius: 8 },
  thumbTitle: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 13, color: C.T1 },
  thumbSub: { fontFamily: FONTS.MONO, fontSize: 10, color: C.T2, marginTop: 4 },

  analysisCard: { backgroundColor: C.SURFACE, borderLeftWidth: 3, borderLeftColor: C.BLUE, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.BORDER, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  analysisLbl: { fontFamily: FONTS.MONO, fontSize: 9, color: C.BLUE, marginBottom: 8 },
  analysisTxt: { fontFamily: FONTS.JAKARTA, fontSize: 15, color: C.T1, lineHeight: 24 },

  contextRow: { marginTop: 16, paddingHorizontal: 16 },
  contextLbl: { fontFamily: FONTS.MONO, fontSize: 10, color: C.T2, marginBottom: 8 },
  contextBar: { height: 6, backgroundColor: C.BORDER, borderRadius: 3, overflow: 'hidden' },
  contextFill: { height: '100%', borderRadius: 3 },

  actions: { padding: 16, gap: 10, marginTop: 8 },
  primaryBtn: { backgroundColor: C.BLUE, borderRadius: 14, padding: 16, alignItems: 'center' },
  primaryBtnTxt: { fontFamily: FONTS.SYNE, fontSize: 16, color: '#FFF' },
  outlineBtn: { backgroundColor: C.SURFACE, borderWidth: 1, borderColor: C.BORDER, borderRadius: 14, padding: 16, alignItems: 'center' },
  outlineBtnTxt: { fontFamily: FONTS.JAKARTA_SEMI, fontSize: 15, color: C.T1 }
});
