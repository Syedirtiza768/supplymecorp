import { fetchFeaturedProducts, fetchNewProductsByCategory, Product } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedProductsProps {
  limit?: number;
}


  const products = await fetchFeaturedProducts(limit);

  let fallbackProducts: Product[] = [];
  if (!products || products.length === 0) {
    // Fallback: get 6 products from 6 different categories with price > 0
    const allByCategory = await fetchNewProductsByCategory();
    const seenCategories = new Set();
    fallbackProducts = allByCategory.filter(
      (p) => {
        // Only allow one per category and price > 0
        if (!p.categoryTitleDescription || seenCategories.has(p.categoryTitleDescription)) return false;
        if (typeof p.price !== 'number' || p.price <= 0) return false;
        seenCategories.add(p.categoryTitleDescription);
        return true;
      }
    ).slice(0, 6);
  }

  const displayProducts = (products && products.length > 0) ? products : fallbackProducts;

  return (
    <section className="featured-products py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="block group" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="product-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-yellow-50 cursor-pointer">
                <div className="relative w-full h-48 mb-4 bg-gray-100 rounded">
                  {product.itemImage1 ? (
                    <Image
                      src={product.itemImage1}
                      alt={product.onlineTitleDescription || product.brandName || 'Product'}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
                  Featured
                </span>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.onlineTitleDescription || product.brandName || 'Untitled Product'}
                </h3>
                {product.brandName && (
                  <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
