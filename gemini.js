export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 허용' });

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return res.status(500).json({ error: 'Gemini API 키가 설정되지 않았어요' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt가 필요해요' });

  const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  for (let i = 0; i < MODELS.length; i++) {
    if (i > 0) await wait(1500);
    const model = MODELS[i];
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tools: [{ google_search: {} }],
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 3500 },
          }),
        }
      );

      if (response.status === 404 || response.status === 429 || response.status === 503) {
        console.warn(`${model} ${response.status}, 다음 모델로...`);
        continue;
      }

      const data = await response.json();
      if (data.error) {
        const msg = data.error.message || '';
        if (msg.includes('high demand') || msg.includes('quota') || msg.includes('not found')) {
          console.warn(`${model} 에러: ${msg}`);
          continue;
        }
        return res.status(400).json({ error: msg });
      }

      return res.status(200).json(data);
    } catch (e) {
      console.warn(`${model} 예외: ${e.message}`);
      continue;
    }
  }

  res.status(503).json({ error: '모든 모델이 현재 사용 불가해요. 잠시 후 다시 시도해 주세요.' });
}
