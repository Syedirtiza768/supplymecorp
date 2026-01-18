// Test endpoint to diagnose customer API issues
export async function GET(req) {
  const apiKey = process.env.CUSTOMERS_API_KEY;
  const auth = process.env.CUSTOMERS_AUTH;
  
  console.log('=== Customer API Test ===');
  console.log('API Key:', apiKey ? `Set (${apiKey.length} chars)` : 'MISSING');
  console.log('Auth:', auth ? `Set (${auth.length} chars)` : 'MISSING');
  
  if (!apiKey || !auth) {
    return new Response(JSON.stringify({ 
      error: 'Missing credentials',
      apiKey: apiKey ? 'SET' : 'MISSING',
      auth: auth ? 'SET' : 'MISSING'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log('Fetching from: https://utility.rrgeneralsupply.com/customers');
    console.log('Headers:', { APIKey: apiKey.substring(0, 10) + '...', Authorization: auth.substring(0, 20) + '...' });
    
    const response = await fetch('https://utility.rrgeneralsupply.com/customers', {
      headers: {
        'APIKey': apiKey,
        'Authorization': auth,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      return new Response(JSON.stringify({ 
        error: 'API request failed',
        status: response.status,
        details: errorText
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    console.log('Success! Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Keys:', Object.keys(data));
    
    return new Response(JSON.stringify({
      success: true,
      dataType: typeof data,
      isArray: Array.isArray(data),
      keys: Object.keys(data),
      customerCount: data.Customers ? data.Customers.length : 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Exception:', error);
    return new Response(JSON.stringify({ 
      error: 'Exception',
      message: error.message,
      stack: error.stack
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
