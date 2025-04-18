import { Mail, MapPin, Phone } from "lucide-react";
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

export default function ContactPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Contact Us</h1>
          <p className="mt-4 text-muted-foreground">
            Have questions about our products or services? We're here to help.
            Fill out the form or use the contact information below to get in
            touch with our team.
          </p>

          <div className="mt-8 grid gap-6">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Our Location</CardTitle>
                  <CardDescription className="mt-1">
                    18-07 Astoria Blvd <br />
                    Long Island City, NY 11102
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Phone Number</CardTitle>
                  <CardDescription className="mt-1">
                    <a href="tel:7185427322" className="hover:text-primary">
                      (718) 278-8480
                    </a>
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Email Address</CardTitle>
                  <CardDescription className="mt-1">
                    <a
                      href="mailto:info@rrgeneralsupply.com"
                      className="hover:text-primary"
                    >
                      info@rrgeneralsupply.com
                    </a>
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Business Hours</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>Monday - Friday</div>
              <div>8 a.m. – 5 p.m. EST</div>
              <div>Saturday</div>
              <div>9 a.m. – 2 p.m. EST</div>
              <div>Sunday</div>
              <div>Closed</div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="min-h-[150px]"
                  />
                </div>
                <Button type="submit" className="mt-2">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">Find Us</h2>
        <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9729445953147!2d-73.8861!3d40.8142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f4d0b94b9f85%3A0x9ae5b5a3e1e3503!2s1260%20Oak%20Point%20Ave%2C%20Bronx%2C%20NY%2010474!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
