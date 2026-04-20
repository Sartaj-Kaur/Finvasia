/**
 * Speech-to-Text using Groq Whisper (whisper-large-v3-turbo)
 * Reuses the existing EXPO_PUBLIC_GROQ_API_KEY — no extra key needed.
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!GROQ_KEY) {
    console.warn('[STT] Missing EXPO_PUBLIC_GROQ_API_KEY');
    return '';
  }

  try {
    const formData = new FormData();
    // React Native requires the file appended as an object with uri/name/type
    formData.append('file', { uri: audioUri, name: 'recording.m4a', type: 'audio/m4a' } as any);
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('response_format', 'json');
    // Accept both Hindi and English
    formData.append('language', 'en');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        // Do NOT set Content-Type manually — fetch sets it automatically with the correct boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (data.error) {
      console.error('[STT] Groq Whisper error:', data.error.message);
      return '';
    }

    return (data.text as string)?.trim() ?? '';
  } catch (e) {
    console.error('[STT] Transcription failed:', e);
    return '';
  }
}
