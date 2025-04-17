import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategoryById, getSubcategoryById } from "@/lib/data"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  subcategory: string
  rating: number
  reviewCount?: number
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  subcategory,
  rating,
  reviewCount,
  inStock,
  isNew = false,
  isSale = false,
}: ProductCardProps) {
  const categoryData = getCategoryById(category)
  const subcategoryData = getSubcategoryById(category, subcategory)

  const categoryName = categoryData ? categoryData.name : ""
  const subcategoryName = subcategoryData ? subcategoryData.name : ""

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/product/${id}`}>
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={300}
            className="aspect-square w-full object-cover transition-transform hover:scale-105"
          />
        </Link>
        {(isNew || isSale) && (
          <div className="absolute left-2 top-2">
            {isNew && <Badge className="bg-blue-500">New</Badge>}
            {isSale && <Badge className="bg-red-500">Sale</Badge>}
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="outline" className="border-white text-white">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-1 text-xs text-muted-foreground">
          <Link href={`/category/${category}/${subcategory}`} className="hover:text-primary">
            {subcategoryName}
          </Link>
        </div>
        <Link href={`/product/${id}`}>
          <h3 className="line-clamp-2 font-medium hover:text-primary">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="font-bold">${price.toFixed(2)}</div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`h-4 w-4 ${i < rating ? "fill-primary" : "fill-muted"}`} viewBox="0 0 20 20">
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-primary hover:bg-primary-700" disabled={!inStock}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
