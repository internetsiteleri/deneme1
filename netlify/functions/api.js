exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: { message: 'API key bulunamadi.' } }) };
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const rawText = await geminiRes.text();
    console.log('Gemini status:', geminiRes.status);
    console.log('Gemini response:', rawText);

    let data;
    try { data = JSON.parse(rawText); } catch(e) { data = { error: { message: 'Gemini gecersiz yanit: ' + rawText.slice(0, 300) } }; }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Handler error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: err.message } })
    };
  }
};
