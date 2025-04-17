import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categories, products } from "@/lib/data"
import ProductCard from "@/components/product-card"

export default function ShopPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Shop</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shop All Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our extensive collection of quality hardware and supplies.</p>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="group">
              <div className="overflow-hidden rounded-lg border transition-all group-hover:shadow-md">
                <div className="aspect-square bg-muted p-6">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{category.subcategories.length} subcategories</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {products.length > 8 && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-700">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
