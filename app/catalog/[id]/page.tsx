import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import FlipBook from "@/components/flip-book"

export default function CatalogViewerPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/catalog" className="hover:text-foreground">
          Catalogs
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Spring & Summer 2025</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Spring & Summer 2025 Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our latest catalog featuring our complete product line and seasonal specials.
        </p>
      </div>

      <div className="mb-8">
        <FlipBook />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Can't find what you're looking for?</h2>
          <p className="mt-1 text-muted-foreground">
            Our catalog shows only a portion of our inventory. Contact us for special orders.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/catalog">Back to Catalogs</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary-700">
            <Link href="/special-item">Request Special Item</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
