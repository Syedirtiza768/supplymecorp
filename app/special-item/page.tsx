import Link from "next/link";
import { ChevronRight, FileText, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SpecialItemPage() {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">
          Need a Special Item?
        </span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Need a Special Item?</h1>
        <p className="mt-2 text-muted-foreground">
          Can't find what you're looking for? We can help source special items
          for your project needs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request a Special Item</CardTitle>
            <CardDescription>
              Fill out the form below with as much detail as possible about the
              item you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Email address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Phone number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input id="company" placeholder="Company name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="item-name">Item Name/Description</Label>
                <Input id="item-name" placeholder="Item name or description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer (if known)</Label>
                <Input id="manufacturer" placeholder="Manufacturer name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model/Part Number (if known)</Label>
                <Input id="model" placeholder="Model or part number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity Needed</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Quantity"
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="urgency">How Urgent Is Your Request?</Label>
                <RadioGroup defaultValue="standard">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard (1-2 weeks)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urgent" id="urgent" />
                    <Label htmlFor="urgent">Urgent (3-5 business days)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="emergency" id="emergency" />
                    <Label htmlFor="emergency">Emergency (ASAP)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea
                  id="details"
                  placeholder="Please provide any additional information that might help us source your item"
                  className="min-h-[120px]"
                />
              </div>
              <Button
                type="submit"
                className="mt-2 bg-primary hover:bg-primary-700"
              >
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <div>
                  <h3 className="font-bold">Submit Your Request</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form with as much detail as possible about the
                    item you need.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <div>
                  <h3 className="font-bold">We'll Research Options</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team will research availability, pricing, and delivery
                    options for your item.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <div>
                  <h3 className="font-bold">Receive a Quote</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll provide you with pricing and availability information
                    within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  4
                </div>
                <div>
                  <h3 className="font-bold">Confirm and Order</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you approve the quote, we'll place the order and keep
                    you updated on delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us Directly</CardTitle>
              <CardDescription>
                Prefer to speak with someone directly? Contact our special
                orders department.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">
                    <a href="tel:7185427322" className="hover:text-primary">
                      (718) 278-8480
                    </a>{" "}
                    (Ask for Special Orders)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-muted-foreground">
                    <a
                      href="mailto:specialorders@rrgeneralsupply.com"
                      className="hover:text-primary"
                    >
                      specialorders@rrgeneralsupply.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Fax Your Request</p>
                  <p className="text-sm text-muted-foreground">718.542.7369</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
