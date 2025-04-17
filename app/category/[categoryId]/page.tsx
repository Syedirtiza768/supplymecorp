import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"
import { getCategoryById, getProductsByCategory } from "@/lib/data"

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const category = getCategoryById(params.categoryId)
  const products = getProductsByCategory(params.categoryId)

  if (!category) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <p className="mt-4">The category you're looking for doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{category.name}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our selection of quality {category.name.toLowerCase()} products.
        </p>
      </div>

      {/* Subcategories */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold">Subcategories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {category.subcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/category/${category.id}/${subcategory.id}`}>
              <Card className="transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="font-medium">{subcategory.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">View Products</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Featured Products */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="mt-2 text-muted-foreground">
              We couldn't find any products in this category. Please check back later or browse other categories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
