/**
 * Performance monitoring utilities
 */

// Track API response times
const performanceMetrics = {
  apiCalls: [],
  maxTracked: 50, // Keep last 50 calls
};

export function trackApiCall(endpoint, duration, status) {
  performanceMetrics.apiCalls.unshift({
    endpoint,
    duration,
    status,
    timestamp: Date.now(),
  });
  
  // Keep only recent calls
  if (performanceMetrics.apiCalls.length > performanceMetrics.maxTracked) {
    performanceMetrics.apiCalls.pop();
  }
  
  // Log slow requests
  if (duration > 1000) {
    console.warn(`⚠️ Slow API call: ${endpoint} took ${duration}ms`);
  }
}

export function getPerformanceStats() {
  if (performanceMetrics.apiCalls.length === 0) {
    return null;
  }
  
  const durations = performanceMetrics.apiCalls.map(c => c.duration);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const max = Math.max(...durations);
  const min = Math.min(...durations);
  
  return {
    totalCalls: performanceMetrics.apiCalls.length,
    avgDuration: Math.round(avg),
    maxDuration: max,
    minDuration: min,
    recentCalls: performanceMetrics.apiCalls.slice(0, 10),
  };
}

export function clearPerformanceStats() {
  performanceMetrics.apiCalls = [];
}

// Measure async function execution time
export async function measureAsync(name, fn) {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);
    console.log(`⏱️ ${name} took ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    console.error(`❌ ${name} failed after ${duration}ms:`, error);
    throw error;
  }
}

// Create a fetch wrapper that tracks performance
export async function trackedFetch(url, options = {}) {
  const start = performance.now();
  const endpoint = url.toString().split('?')[0]; // Remove query params for grouping
  
  try {
    const response = await fetch(url, options);
    const duration = Math.round(performance.now() - start);
    trackApiCall(endpoint, duration, response.status);
    
    return response;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    trackApiCall(endpoint, duration, 'error');
    throw error;
  }
}
