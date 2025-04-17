import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Download, Eye, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const catalogs = [
  {
    id: "spring-summer-2025",
    title: "Spring & Summer 2025",
    image: "/placeholder.svg?height=400&width=300&text=Spring/Summer 2025",
    pages: 120,
    date: "January 15, 2025",
  },
  {
    id: "fall-winter-2024",
    title: "Fall & Winter 2024",
    image: "/placeholder.svg?height=400&width=300&text=Fall/Winter 2024",
    pages: 110,
    date: "August 10, 2024",
  },
  {
    id: "spring-summer-2024",
    title: "Spring & Summer 2024",
    image: "/placeholder.svg?height=400&width=300&text=Spring/Summer 2024",
    pages: 115,
    date: "January 20, 2024",
  },
  {
    id: "fall-winter-2023",
    title: "Fall & Winter 2023",
    image: "/placeholder.svg?height=400&width=300&text=Fall/Winter 2023",
    pages: 105,
    date: "August 15, 2023",
  },
]

const flyers = [
  {
    id: "natural-gas-alarms",
    title: "Natural Gas Alarms",
    image: "/placeholder.svg?height=400&width=300&text=Natural Gas Alarms",
    date: "March 1, 2025",
  },
  {
    id: "winter-supplies",
    title: "Winter Supplies",
    image: "/placeholder.svg?height=400&width=300&text=Winter Supplies",
    date: "November 5, 2024",
  },
  {
    id: "summer-cooling",
    title: "Summer Cooling Products",
    image: "/placeholder.svg?height=400&width=300&text=Summer Cooling",
    date: "May 15, 2024",
  },
]

export default function CatalogPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Catalogs</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catalogs & Flyers</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our latest catalogs and promotional flyers. View online or download for offline reference.
        </p>
      </div>

      <Tabs defaultValue="catalogs" className="mb-8">
        <TabsList>
          <TabsTrigger value="catalogs">Seasonal Catalogs</TabsTrigger>
          <TabsTrigger value="flyers">Promotional Flyers</TabsTrigger>
        </TabsList>
        <TabsContent value="catalogs" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalogs.map((catalog) => (
              <Card key={catalog.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={catalog.image || "/placeholder.svg"}
                      alt={catalog.title}
                      width={300}
                      height={400}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <Button variant="secondary" size="sm" className="mr-2" asChild>
                        <Link href={`/catalog/${catalog.id}`}>
                          <Eye className="mr-1 h-4 w-4" /> View
                        </Link>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{catalog.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{catalog.pages} pages</p>
                  <p className="text-sm text-muted-foreground">Published: {catalog.date}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/catalog/${catalog.id}`}>
                      <Eye className="mr-1 h-4 w-4" /> View Online
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-1 h-4 w-4" /> Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="flyers" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flyers.map((flyer) => (
              <Card key={flyer.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={flyer.image || "/placeholder.svg"}
                      alt={flyer.title}
                      width={300}
                      height={400}
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                      <Button variant="secondary" size="sm" className="mr-2">
                        <Eye className="mr-1 h-4 w-4" /> View
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Download className="mr-1 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg">{flyer.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Published: {flyer.date}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/flyer/${flyer.id}`}>
                      <Eye className="mr-1 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" /> Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg bg-muted p-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-xl font-bold">Need a Physical Catalog?</h2>
            <p className="mt-1 text-muted-foreground">
              We can mail you a printed copy of our latest catalog. Contact us to request yours.
            </p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary-700">
            Request Printed Catalog
          </Button>
        </div>
      </div>
    </div>
  )
}
