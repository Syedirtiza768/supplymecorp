import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Hardware", href: "/category/hardware" },
  { name: "Paint & Paint Sundries", href: "/category/paint" },
  { name: "Construction/Building Products", href: "/category/construction" },
  { name: "Electrical Supplies", href: "/category/electrical" },
  { name: "Plumbing Supplies", href: "/category/plumbing" },
  { name: "Janitorial Supplies", href: "/category/janitorial" },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="RR General Supply Logo"
                width={200}
                height={140}
                className="h-auto "
              />
            </Link>
            <p className="text-sm text-gray-300">
              Providing quality hardware and building maintenance supplies since
              1926. Serving contractors, building managers, and DIY customers.
            </p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-300 hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Twitter">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-300 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="Instagram">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-300 hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-300 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-300 hover:text-white hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View All Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-300">
              Subscribe to our newsletter for the latest products, promotions,
              and updates.
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="w-full bg-primary hover:bg-primary-700">
                Subscribe
              </Button>
            </form>
            <div className="mt-6">
              <h4 className="mb-2 text-base font-bold">Contact Us</h4>
              <address className="not-italic text-sm text-gray-300">
                <p>18-07 Astoria Blvd</p>
                <p>Long Island City, NY 11102</p>
                <p className="mt-2">
                  <a
                    href="tel:7185427322"
                    className="hover:text-white hover:underline"
                  >
                    Phone: (718) 278-8480
                  </a>
                </p>
                <p className="mt-2">
                  <span>Hours:</span> <br />
                  <span>8 a.m. – 5 p.m. EST</span>
                  <br />
                  <span>(Monday - Friday)</span>
                  <br />
                  <span>9 a.m. – 2 p.m. EST</span>
                  <br />
                  <span>(Saturday)</span>
                </p>
              </address>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-6">
        <div className="container">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} RR General Supply. All rights reserved.
            Est. 1926
          </p>
        </div>
      </div>
    </footer>
  );
}
