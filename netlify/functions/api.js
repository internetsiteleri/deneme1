exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: { message: 'API key bulunamadi.' } }) };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [
          { role: 'system', content: 'Sen deneyimli bir Turkce ogretmenisin. YALNIZCA gecerli JSON dondur, baska hicbir sey yazma.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 3000
      })
    });

    const rawText = await response.text();
    console.log('OpenRouter status:', response.status);
    console.log('OpenRouter response:', rawText);

    let data;
    try { data = JSON.parse(rawText); } catch(e) {
      return { statusCode: 500, body: JSON.stringify({ error: { message: 'Gecersiz yanit: ' + rawText.slice(0, 300) } }) };
    }

    if (data.error) {
      return { statusCode: 500, body: JSON.stringify({ error: { message: data.error.message || JSON.stringify(data.error) } }) };
    }

    const text = data.choices?.[0]?.message?.content || '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ text })
    };

  } catch (err) {
    console.log('Handler error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: err.message } })
    };
  }
};
