import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building, Clock, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { categories } from "@/lib/data";
import MyFlipBook from "../components/custom/MyFlipBook";
// import MyFlipBook from "../components/custom/MyFlipBook";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8 pt-6 md:gap-12 md:pb-16">
      {/* Hero Banner - Seasonal Promotion */}
      <section className="container">
        <div className="relative overflow-hidden rounded-lg bg-primary">
          <div className="grid md:grid-cols-2">
            <div className="p-6 md:p-10">
              <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                SPRING SAVINGS
              </h1>
              <h2 className="mt-2 text-xl font-bold text-white">
                UP TO 30% OFF SELECT ITEMS
              </h2>
              <h3 className="mt-1 text-xl font-bold text-white">
                LIMITED TIME ONLY
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white">POWER TOOLS & ACCESSORIES</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white">PAINT & PAINTING SUPPLIES</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-white">GARDEN & OUTDOOR EQUIPMENT</p>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  SHOP NOW
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-6">
              <Image
                src="/placeholder.svg?height=400&width=400&text=Spring Sale"
                alt="Spring Sale"
                width={400}
                height={400}
                className="max-h-[400px] w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2025 Catalog Section */}
      <section className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">
            2025 Catalog: <span className="text-primary">Spring & Summer</span>
          </h2>
          <MyFlipBook />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Featured Categories
            </h2>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="aspect-square w-full object-cover"
                  />
                  <CardContent className="p-3">
                    <h3 className="text-center text-sm font-medium">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Promotions */}
      <section className="bg-muted py-8">
        <div className="container">
          <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
            Seasonal Promotions
          </h2>
          <Carousel className="mx-auto max-w-5xl">
            <CarouselContent>
              {[1, 2, 3].map((item) => (
                <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardContent className="flex aspect-square flex-col items-center justify-center p-6">
                      <div className="text-center">
                        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3">
                          <Package className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Spring Sale</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Up to 25% off selected items
                        </p>
                        <Button size="sm">Shop Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-muted py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Established 1926</h3>
              <p className="text-sm text-muted-foreground">
                Serving the community with quality products for over 80 years
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Quick and reliable shipping to your job site or home
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Quality Products</h3>
              <p className="text-sm text-muted-foreground">
                Curated selection of professional-grade supplies
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Knowledgeable staff ready to assist with your project needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container">
        <div className="rounded-lg bg-primary/10 p-6 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Stay Updated</h2>
            <p className="mt-2 text-muted-foreground">
              Subscribe to our newsletter for the latest products, promotions,
              and industry news.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
