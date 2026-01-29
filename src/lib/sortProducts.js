/**
 * Sort products so that items with price > 0 appear first,
 * followed by items with price = 0 or without a price
 * @param {Array} products - Array of product objects
 * @returns {Array} Sorted array of products
 */
export function sortProductsByPrice(products) {
  if (!Array.isArray(products)) return products;
  
  return [...products].sort((a, b) => {
    const priceA = parseFloat(a.price) || 0;
    const priceB = parseFloat(b.price) || 0;
    
    // Items with price > 0 come first
    if (priceA > 0 && priceB === 0) return -1;
    if (priceA === 0 && priceB > 0) return 1;
    
    // Within same category (both have price or both don't), maintain original order
    return 0;
  });
}
