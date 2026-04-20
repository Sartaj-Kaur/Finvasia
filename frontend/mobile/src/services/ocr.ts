export async function analyzeReceiptImage(base64Image: string) {
  const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!GROQ_KEY) throw new Error("Missing GROQ API KEY");

  // Format explicitly cleanly for multimodal
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  const groqResponse = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an AI receipt parser. Analyze this receipt image and return ONLY valid JSON:
                {
                  "merchant": "string",
                  "amount": number,
                  "date": "YYYY-MM-DD",
                  "category": "Food|Transport|Shopping|Groceries|Entertainment|Utilities|Healthcare|Other",
                  "items": ["item1", "item2"],
                  "confidence": number (0-100)
                }`
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }],
        temperature: 0.1,
        max_tokens: 400
      })
    }
  );
  
  const result = await groqResponse.json();
  
  if (result.error) {
     throw new Error(`Groq Vision Error: ${result.error.message}`);
  }

  try {
    let content = result.choices[0].message.content;
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(content);
  } catch (e) {
    console.error('Groq Vision JSON Parse error:', e, result);
    return null;
  }
}


