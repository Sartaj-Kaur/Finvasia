export async function analyzeScreenContext(
  transcript: string,
  visionData: any, // Results from google vision
  userContext: any
) {
  const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL || 'llama-3.3-70b-versatile';

  const { agent, name, budgets, spending } = userContext;
  
  const agentVoice: any = {
    SPROUT: 'Friendly, simple, warm. Use short sentences. Celebrate if they are doing well. No jargon.',
    VOLT: 'Direct, punchy, no fluff. Challenge when needed. Max 4 sentences. Real talk.',
    ORACLE: 'Data-driven, precise, reference percentages and projections. Technical but clear.'
  };
  
  const prompt = `
You are ${agent}, a financial AI assistant for ${name}.
Voice style: ${agentVoice[agent] || agentVoice['VOLT']}

USER SAID: "${transcript}"

WHAT IS ON THEIR SCREEN:
${JSON.stringify(visionData, null, 2)}

THEIR FINANCIAL CONTEXT:
- Monthly income: ₹${userContext.income}
- Food budget: ₹${budgets?.food?.spent} used of ₹${budgets?.food?.limit}
- Total spend this month: ₹${spending?.total || 0}
- Days left in month: ${userContext.daysLeft}
- Recent pattern: ${userContext.topPattern}

Give a SHORT analysis (max 4 sentences) in your voice style.
Reference the specific amount on their screen.
Tell them if this purchase fits their budget or not.
End with one concrete action or verdict.
Do NOT say "I" — speak naturally.
`;

  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    }
  );
  
  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Failed to analyze context. Ask again?';
}
