// In-memory cache for customer data
let customerCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(req) {
  try {
    const apiKey = process.env.CUSTOMERS_API_KEY;
    const auth = process.env.CUSTOMERS_AUTH;
    
    if (!apiKey || !auth) {
      console.error('❌ Missing API credentials in environment variables');
      console.error('Required: CUSTOMERS_API_KEY, CUSTOMERS_AUTH');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error: Missing API credentials',
        details: 'Contact administrator - API credentials not configured'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    // Check cache
    const now = Date.now();
    const cacheValid = customerCache && (now - cacheTimestamp) < CACHE_DURATION;
    
    let data;
    
    if (cacheValid) {
      console.log('✅ Using cached customer data (age:', Math.round((now - cacheTimestamp) / 1000), 'seconds)');
      data = customerCache;
    } else {
      console.log('🔍 Fetching customers from Counterpoint API...');
      const startTime = Date.now();
      
      const response = await fetch('https://utility.rrgeneralsupply.com/customers', {
        headers: {
          'APIKey': apiKey,
          'Authorization': auth,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Counterpoint API error:', response.status, errorText);
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch customers from Counterpoint',
          details: `HTTP ${response.status}: ${errorText}`,
          hint: 'The external customer database is unavailable'
        }), { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      data = await response.json();
      const fetchTime = Date.now() - startTime;
      
      // Cache the data
      customerCache = data;
      cacheTimestamp = now;
      
      console.log('✅ Fetched and cached customers (took', fetchTime, 'ms)');
      console.log('📊 Customer count:', data.Customers?.length || 0);
    }
    
    // If email filter is provided, return only that customer
    if (email) {
      const customers = data.Customers || [];
      const customer = customers.find(
        (c) => c.EMAIL_ADRS_1 && c.EMAIL_ADRS_1.trim().toLowerCase() === email.trim().toLowerCase()
      );
      
      if (!customer) {
        return new Response(JSON.stringify({ 
          error: 'Customer not found',
          email: email
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        Customers: [customer],
        ErrorCode: data.ErrorCode 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=300', // 5 minutes
        },
      });
    }
    
    // Return all customers with cache header
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300', // 5 minutes
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return new Response(JSON.stringify({ 
      error: 'Proxy error',
      details: error.message,
      hint: 'Check server logs and network connectivity'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
