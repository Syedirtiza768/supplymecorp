// Debug endpoint to check environment variables
export async function GET(req) {
  const envVars = {
    CUSTOMERS_API_KEY: process.env.CUSTOMERS_API_KEY ? 'SET (length: ' + process.env.CUSTOMERS_API_KEY.length + ')' : 'MISSING',
    CUSTOMERS_AUTH: process.env.CUSTOMERS_AUTH ? 'SET (length: ' + process.env.CUSTOMERS_AUTH.length + ')' : 'MISSING',
    NEXT_PUBLIC_CUSTOMERS_AUTH: process.env.NEXT_PUBLIC_CUSTOMERS_AUTH ? 'SET (length: ' + process.env.NEXT_PUBLIC_CUSTOMERS_AUTH.length + ')' : 'MISSING',
    COUNTERPOINT_API_URL: process.env.COUNTERPOINT_API_URL || 'MISSING',
    PORT: process.env.PORT || 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
  };

  return new Response(JSON.stringify(envVars, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
