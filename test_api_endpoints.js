// Test script to verify API endpoints are working
const API_BASE = 'http://localhost:3000';

async function testEndpoint(name, url) {
  console.log(`\n🔍 Testing ${name}...`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`❌ ${name} failed with status: ${response.status}`);
      return;
    }
    const data = await response.json();
    console.log(`✅ ${name} returned ${data.length} products`);
    if (data.length > 0) {
      console.log(`   Sample: ${data[0].id} - ${data[0].onlineTitleDescription?.substring(0, 50)}...`);
    }
  } catch (error) {
    console.log(`❌ ${name} error:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Testing Product API Endpoints\n');
  console.log('API_BASE:', API_BASE);
  
  await testEndpoint('Most Viewed Products', `${API_BASE}/api/products/most-viewed?limit=6`);
  await testEndpoint('New Products', `${API_BASE}/api/products/new?limit=6`);
  await testEndpoint('Featured Products', `${API_BASE}/api/products/featured?limit=6`);
  await testEndpoint('New By Category', `${API_BASE}/api/products/new-by-category`);
  
  console.log('\n✅ All tests complete!');
}

runTests();
