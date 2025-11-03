export async function GET(req) {
  try {
    const apiKey = process.env.CUSTOMERS_API_KEY;
    const auth = process.env.CUSTOMERS_AUTH;
    
    if (!apiKey || !auth) {
      console.error('Missing API credentials');
      return new Response(JSON.stringify({ error: 'Missing API credentials' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const response = await fetch('https://utility.rrgeneralsupply.com/customers', {
      headers: {
        'APIKey': apiKey,
        'Authorization': auth,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch customers', details: errorText }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log('API response type:', typeof data, 'isArray:', Array.isArray(data));
    console.log('API response keys:', Object.keys(data));
    console.log('API response sample:', JSON.stringify(data).substring(0, 500));
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy error: ' + error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
