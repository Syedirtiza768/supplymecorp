import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { getCategoryById, getProductById, getRelatedProducts, getSubcategoryById } from "@/lib/data"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id)

  if (!product) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="mt-4">The product you're looking for doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    )
  }

  const category = getCategoryById(product.category)
  const subcategory = getSubcategoryById(product.category, product.subcategory)
  const relatedProducts = getRelatedProducts(product)

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <Link href={`/category/${category.id}`} className="hover:text-foreground">
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        {subcategory && (
          <>
            <Link href={`/category/${product.category}/${product.subcategory}`} className="hover:text-foreground">
              {subcategory.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="font-medium text-foreground">{product.name}</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="overflow-hidden rounded-md border">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  width={150}
                  height={150}
                  className="aspect-square w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
          <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Availability:</span>
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            {product.specifications && product.specifications["SKU"] && (
              <div className="flex items-center justify-between">
                <span className="font-medium">SKU:</span>
                <span>{product.specifications["SKU"]}</span>
              </div>
            )}
            {category && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Category:</span>
                <Link href={`/category/${product.category}`} className="hover:text-primary">
                  {category.name}
                </Link>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">1</span>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1 bg-primary hover:bg-primary-700" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">Features</h3>
                {product.features ? (
                  <ul className="ml-6 list-disc space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No feature information available for this product.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">Technical Specifications</h3>
                {product.specifications ? (
                  <div className="grid gap-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4 py-2">
                        <div className="font-medium">{key}</div>
                        <div>{value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No specification information available for this product.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl font-bold">Customer Reviews</h3>
                <p>
                  This product has {product.reviewCount} reviews with an average rating of {product.rating} stars.
                </p>
                {/* Reviews would be rendered here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}
