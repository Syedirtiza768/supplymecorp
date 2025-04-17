import Link from "next/link"
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCard from "@/components/product-card"
import { getCategoryById, getProductsBySubcategory, getSubcategoryById } from "@/lib/data"

// Mock data for brands
const brands = [
  { id: "dewalt", name: "DeWalt" },
  { id: "milwaukee", name: "Milwaukee" },
  { id: "stanley", name: "Stanley" },
  { id: "bosch", name: "Bosch" },
  { id: "makita", name: "Makita" },
]

export default function SubcategoryPage({
  params,
}: {
  params: { categoryId: string; subcategoryId: string }
}) {
  const category = getCategoryById(params.categoryId)
  const subcategory = getSubcategoryById(params.categoryId, params.subcategoryId)
  const products = getProductsBySubcategory(params.categoryId, params.subcategoryId)

  if (!category || !subcategory) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
        <p className="mt-4">The subcategory you're looking for doesn't exist.</p>
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
        <Link href={`/category/${category.id}`} className="hover:text-foreground">
          {category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{subcategory.name}</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
          <p className="text-muted-foreground">Browse our selection of quality {subcategory.name.toLowerCase()}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Brands</h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand.id}-mobile`} />
                        <Label htmlFor={`brand-${brand.id}-mobile`}>{brand.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-4 text-lg font-medium">Price Range</h3>
                  <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="Min" className="w-20" />
                    <span>to</span>
                    <Input type="number" placeholder="Max" className="w-20" />
                    <Button size="sm">Apply</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-4 text-lg font-medium">Availability</h3>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="availability-all-mobile" />
                      <Label htmlFor="availability-all-mobile">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-stock" id="availability-in-stock-mobile" />
                      <Label htmlFor="availability-in-stock-mobile">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="out-of-stock" id="availability-out-of-stock-mobile" />
                      <Label htmlFor="availability-out-of-stock-mobile">Out of Stock</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <h3 className="mb-4 text-lg font-medium">Brands</h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox id={`brand-${brand.id}`} />
                      <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-medium">Price Range</h3>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Input type="number" placeholder="Min" className="w-20" />
                    <span>to</span>
                    <Input type="number" placeholder="Max" className="w-20" />
                  </div>
                  <Button size="sm">Apply</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="mb-4 text-lg font-medium">Availability</h3>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="availability-all" />
                    <Label htmlFor="availability-all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-stock" id="availability-in-stock" />
                    <Label htmlFor="availability-in-stock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out-of-stock" id="availability-out-of-stock" />
                    <Label htmlFor="availability-out-of-stock">Out of Stock</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="mt-2 text-muted-foreground">
                We couldn't find any products in this subcategory. Please check back later or browse other categories.
              </p>
              <Button asChild className="mt-6">
                <Link href={`/category/${category.id}`}>Back to {category.name}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
