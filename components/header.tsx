"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  MapPin,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNavItems = [
  { name: "HOME", href: "/" },
  { name: "CATALOG", href: "/catalog" },
  { name: "NEED A SPECIAL ITEM?", href: "/special-item" },
  { name: "MY ACCOUNT", href: "/account" },
  { name: "ABOUT US", href: "/about" },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar with address and account info */}
      <div className="bg-gray-200 py-2">
        <div className="container flex items-center justify-between">
          <div className="flex items-center text-sm">
            <MapPin className="mr-1 h-4 w-4" />
            <span>18-07 Astoria Blvd, Long Island City, NY 11102</span>
          </div>
          <div className="text-sm">
            <Link href="/account" className="hover:underline">
              HELLO, {isLoggedIn ? "USER" : "GUEST"} | MY ACCOUNT
            </Link>
          </div>
        </div>
      </div>

      {/* Main header with logo, search, and cart */}
      <div className="border-b bg-background">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-4">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/General%20Supply%28gold%29_jpg.jpg-qnYVHNdcxTwCNZkLQyXPuhxAMKNMHA.jpeg"
                      alt="RR General Supply Logo"
                      width={150}
                      height={75}
                      className="h-auto"
                    />
                  </Link>
                  <div className="flex flex-col gap-3">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-xl font-bold">
                      Categories
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {categories.map((category) => (
                        <div key={category.id} className="space-y-1">
                          <Link
                            href={`/category/${category.id}`}
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {category.name}
                          </Link>
                          <div className="ml-4 space-y-1">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/category/${category.id}/${subcategory.id}`}
                                className="block text-xs text-muted-foreground transition-colors hover:text-primary"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-muted-foreground">
                      Call us:{" "}
                      <a
                        href="tel:7185427322"
                        className="font-medium text-foreground hover:text-primary"
                      >
                        (718) 278-8480
                      </a>
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/General%20Supply%28gold%29_jpg.jpg-qnYVHNdcxTwCNZkLQyXPuhxAMKNMHA.jpeg"
                alt="RR General Supply Logo"
                width={80}
                height={80}
                className="h-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">RR GENERAL SUPPLY</h1>
                <p className="text-sm text-muted-foreground">
                  Industry Leaders For Over 80 Years!
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <div className="text-xs text-muted-foreground">HELP LINE</div>
              <div className="text-lg font-bold">(718) 278-8480</div>
            </div>

            <Link href="/cart" className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              <div>
                <div className="text-xs text-muted-foreground">MY CART</div>
                <div className="font-medium">{cartCount} ITEMS</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="border-t bg-background py-2">
          <div className="container flex items-center justify-between">
            <div className="flex-1">
              <form className="flex w-full max-w-xl">
                <Input
                  type="search"
                  placeholder="Search Keyword or Item Number"
                  className="rounded-r-none border-r-0"
                />
                <Button
                  type="submit"
                  className="rounded-l-none bg-primary hover:bg-primary-700"
                >
                  SEARCH
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b bg-secondary text-white">
        <div className="container flex">
          <div className="relative group">
            <Button
              variant="ghost"
              className="flex h-12 items-center gap-2 bg-primary px-4 text-white hover:bg-primary-700"
              onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
            >
              SHOP CATEGORIES <ChevronDown className="h-4 w-4" />
            </Button>
            <div className="absolute left-0 top-full z-50 hidden w-64 bg-white text-foreground shadow-lg group-hover:block">
              <div className="grid">
                {categories.map((category) => (
                  <DropdownMenu key={category.id}>
                    <DropdownMenuTrigger asChild>
                      <Link
                        href={`/category/${category.id}`}
                        className="flex items-center justify-between border-b p-3 text-sm hover:bg-muted"
                      >
                        {category.name}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="right"
                      align="start"
                      className="w-56"
                    >
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenuItem key={subcategory.id} asChild>
                          <Link
                            href={`/category/${category.id}/${subcategory.id}`}
                          >
                            {subcategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            </div>
          </div>
          <nav className="flex">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-12 items-center px-4 hover:bg-primary",
                  pathname === item.href ? "bg-primary" : ""
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
