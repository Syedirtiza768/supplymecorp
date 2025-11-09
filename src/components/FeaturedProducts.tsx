import { fetchFeaturedProducts } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedProductsProps {
  limit?: number;
}

export default async function FeaturedProducts({ limit = 12 }: FeaturedProductsProps) {
  const products = await fetchFeaturedProducts(limit);

  if (!products || products.length === 0) {
    return (
      <section className="featured-products py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <p>No featured products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-yellow-50">
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
              <Link
                href={`/products/${product.id}`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
