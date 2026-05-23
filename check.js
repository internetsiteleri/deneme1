export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { uzbek, userAnswer } = body;

    if (!uzbek || !userAnswer) {
      return new Response(JSON.stringify({ error: 'Eksik parametre' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: `Sen Özbekçe-Türkçe dil öğretmenisin. Öğrencinin çevirisini değerlendir.
Yanıtını SADECE şu JSON formatında ver (başka hiçbir şey yazma):
{"correct": true/false, "feedback": "kısa Türkçe geri bildirim (max 2 cümle)", "correct_translation": "doğru Türkçe çeviri"}
correct: öğrencinin çevirisi anlamsal olarak kabul edilebilir mi (tam kelime kelime eşleşme gerekmez, anlam doğruysa true).`,
        messages: [
          {
            role: 'user',
            content: `Özbekçe cümle: "${uzbek}"\nÖğrenci çevirisi: "${userAnswer}"`,
          },
        ],
      }),
    });

    const data = await response.json();
    const raw = data.content?.map((b) => b.text || '').join('') || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Sunucu hatası', detail: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
