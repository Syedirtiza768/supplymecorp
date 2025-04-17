import Image from "next/image"
import { Award, Building, Clock, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">About RR General Supply</h1>
        <p className="mt-4 text-muted-foreground">
          Serving the New York area with quality hardware and building maintenance supplies since 1926.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            RR General Supply has been a cornerstone of the Bronx community for over 80 years. Founded in 1926, our
            family-owned business has grown from a small hardware store to a comprehensive supplier of building
            maintenance products and services.
          </p>
          <p className="mt-4 text-muted-foreground">
            Through decades of economic changes and neighborhood transformations, we've maintained our commitment to
            quality products, fair prices, and exceptional customer service. Our longevity in the industry is a
            testament to our reliability and the trust our customers place in us.
          </p>
          <p className="mt-4 text-muted-foreground">
            Today, we continue to serve contractors, building managers, and DIY enthusiasts with the same dedication
            that has defined our business for generations. While we've embraced modern technology and expanded our
            product offerings, our core values remain unchanged.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src="/placeholder.svg?height=600&width=600&text=Store Front"
            alt="RR General Supply Store"
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <Separator className="my-12" />

      <div className="grid gap-8 md:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Est. 1926</h3>
            <p className="mt-2 text-sm text-muted-foreground">Over 80 years of service to the New York community</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Family Owned</h3>
            <p className="mt-2 text-sm text-muted-foreground">Generations of expertise and personalized service</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Quality Products</h3>
            <p className="mt-2 text-sm text-muted-foreground">Curated selection of professional-grade supplies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Reliable Service</h3>
            <p className="mt-2 text-sm text-muted-foreground">Consistent support for all your project needs</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="mt-4 text-muted-foreground">
          At RR General Supply, our mission is to provide contractors, building managers, and DIY enthusiasts with
          high-quality hardware and building maintenance supplies at competitive prices. We strive to be more than just
          a supplier – we aim to be a trusted partner in your projects, offering expert advice and reliable service.
        </p>
        <p className="mt-4 text-muted-foreground">
          We believe in the value of personal relationships and community engagement. Our knowledgeable staff is
          committed to understanding your needs and helping you find the right solutions. Whether you're managing a
          large construction project or tackling a home improvement task, we're here to support your success.
        </p>
      </div>

      <div className="mt-12 overflow-hidden rounded-lg bg-muted">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold">Visit Our Store</h2>
            <p className="mt-4 text-muted-foreground">
              Experience our extensive product selection in person. Our knowledgeable staff is ready to assist you with
              all your hardware and building maintenance needs.
            </p>
            <div className="mt-6">
              <h3 className="font-bold">Location</h3>
              <address className="not-italic text-muted-foreground">
                <p>1260 Oak Point Avenue</p>
                <p>Bronx, NY 10474</p>
              </address>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Hours</h3>
              <p className="text-muted-foreground">Monday - Friday: 8 a.m. – 5 p.m. EST</p>
              <p className="text-muted-foreground">Saturday: 9 a.m. – 2 p.m. EST</p>
              <p className="text-muted-foreground">Sunday: Closed</p>
            </div>
            <div className="mt-4">
              <h3 className="font-bold">Contact</h3>
              <p className="text-muted-foreground">
                Phone:{" "}
                <a href="tel:7185427322" className="text-primary hover:underline">
                  718.542.7322
                </a>
              </p>
              <p className="text-muted-foreground">
                Email:{" "}
                <a href="mailto:info@rrgeneralsupply.com" className="text-primary hover:underline">
                  info@rrgeneralsupply.com
                </a>
              </p>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=600&width=600&text=Store Interior"
              alt="Inside RR General Supply Store"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
