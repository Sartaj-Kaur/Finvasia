import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';

export async function speakAnalysis(text: string, agent: string) {
  const TTS_KEY = process.env.EXPO_PUBLIC_GOOGLE_TTS_API_KEY;
  if (!TTS_KEY) {
    console.warn('Missing EXPO_PUBLIC_GOOGLE_TTS_API_KEY, fallback to native later');
    return;
  }

  const voiceMap: any = {
    SPROUT: { name: 'en-IN-Standard-A', pitch: 2, rate: 0.9 },
    VOLT:   { name: 'en-IN-Standard-B', pitch: 0, rate: 1.1 },
    ORACLE: { name: 'en-IN-Standard-C', pitch: -2, rate: 0.95 },
  };
  
  const voice = voiceMap[agent] || voiceMap['VOLT'];
  
  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { 
            languageCode: 'en-IN', 
            name: voice.name 
          },
          audioConfig: { 
            audioEncoding: 'MP3',
            pitch: voice.pitch,
            speakingRate: voice.rate
          }
        })
      }
    );
    
    const data = await response.json();
    if (!data.audioContent) {
      console.error('TTS Failed:', data);
      return;
    }

    const audioContent = data.audioContent;
    
    const fs: any = FileSystem;
    const fileUri = (fs.cacheDirectory || '') + 'monager_response.mp3';
    await FileSystem.writeAsStringAsync(fileUri, audioContent, {
      encoding: 'base64' as any
    });
    
    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
    await sound.playAsync();
  } catch (e) {
    console.error('TTS Execution Error: ', e);
  }
}
