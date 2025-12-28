import Link from "next/link";
import { Suspense } from "react";
import Container1 from "@/components/custom/Container1";
import ProductItem1 from "@/components/custom/home/ProductItem1";
import Card1Item from "@/components/custom/home/Card1Item";
import ProductItem2 from "@/components/custom/home/ProductItem2";
import MyFlipBookEnhanced from "@/components/custom/MyFlipBookEnhanced";
import { FeaturedFlipbook } from "@/components/FeaturedFlipbook";
import { LiaShippingFastSolid } from "react-icons/lia";
import ServicesItem from "@/components/custom/home/ServicesItem";
import ProductsByCategorySection from "@/components/custom/home/ProductsByCategorySection";
import { fetchNewProductsByCategory, fetchMostViewed, fetchFeaturedProducts } from "@/lib/products";

export default async function Home() {
  // Fetch products from API
  const [mostViewedProducts, newProducts, featuredProducts] = await Promise.all([
    fetchMostViewed(6).catch(() => []),
    fetchNewProductsByCategory().catch(() => []),
    fetchFeaturedProducts(6).catch(() => [])
  ]);

  // DEBUG: Log newProducts and fallback selection
  if (typeof window !== 'undefined') {
    // Only runs on client, but this is a server component. So, use a debug div below.
  }

  return (
    <div className="w-full min-h-screen ">
      {/* Hero Section */}
      <div className="h-[350px] flex items-center justify-center w-full bg-[url('/images/home/hero.png')] bg-cover bg-top">
        <div className="w-[60%] flex flex-col gap-5 ">
          <h3 className=" text-3xl md:text-5xl font-bold text-white">
            Explore Top{" "}
          </h3>
          <h3 className="text-3xl md:text-5xl font-bold text-white">
            Quality Tools
          </h3>
          <p className="text-xl text-white font-semibold">
            At <span className="text-first">Affordable</span> Prices!
          </p>
          <Link
            href={"#"}
            className="py-3 px-8 rounded-md bg-primary text-white hover:bg-second self-start"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* FlipBook */}
      <section className="container">
        <div className="m-0 p-0">
          {/* Removed 2025 Catalog heading as requested */}
          {/* Show the featured flipbook on the homepage */}
          <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading catalog...</div>}>
            <FeaturedFlipbook />
          </Suspense>
        </div>
      </section>
      {/* PRoducts By Category Section */}
      <ProductsByCategorySection />

      {/* Most Viewed Products Section */}
      <section>
        <Container1 headingTitle={"Most Viewed Products"}>
          <div className="w-full flex">
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {mostViewedProducts.length > 0 ? (
                mostViewedProducts.map((product) => (
                  <ProductItem2
                    key={product.id}
                    img={product.itemImage1 || "/images/products/default.png"}
                    price={product.price || "0.00"}
                    title={product.onlineTitleDescription || product.brandName || "Product"}
                    rating={4}
                    link={`/shop/${product.id}`}
                    id={product.id}
                  />
                ))
              ) : (
                <>
                  <ProductItem2
                    img={"/images/home/deal1.png"}
                    price={"50.00"}
                    title={"Cordless Drill"}
                    rating={4}
                  />
                  <ProductItem2
                    img={"/images/home/deal2.png"}
                    price={"280.00"}
                    oldPrice={"400.00"}
                    title={"Glue Gun"}
                    rating={5}
                    discount={"18"}
                  />
                  <ProductItem2
                    img={"/images/home/deal3.png"}
                    price={"99.00"}
                    title={"Hammer"}
                    rating={4}
                  />
                </>
              )}
            </div>
            <div className="hidden w-[25%] min-h-max bg-[url('/images/home/section-bg3.png')] bg-cover bg-center lg:flex lg:items-end justify-center py-20 px-5">
              <h2 className="text-white font-semibold text-3xl leading-normal ">
                Automatic Digital Equipment
              </h2>
            </div>
          </div>
        </Container1>
      </section>

      {/* Cards Section */}
      <section className="mt-[50px]">
        <div className="w-[80%] mx-auto p-2 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-[250px]">
          <Card1Item
            title1={"Shop For New"}
            title2={"Drill Drivers"}
            link={"#"}
          />
          <Card1Item title1={"Shop For New"} title2={"Microscope"} link={"#"} />
        </div>
      </section>

      {/* New Products */}
      <section className="mt-[50px]">
        <Container1
          headingTitle={"New Products"}
          HeadingButtonLink={"/shop"}
          headingButtonTitle={"View More Products"}
        >
          <div className="w-full flex">
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newProducts.length > 0 ? (
                newProducts.map((product) => (
                  <ProductItem2
                    key={product.id}
                    img={product.itemImage1 || "/images/products/default.png"}
                    price={product.price || "0.00"}
                    title={product.onlineTitleDescription || product.brandName || "Product"}
                    rating={4}
                    link={`/shop/${product.id}`}
                    id={product.id}
                  />
                ))
              ) : (
                <>
                  <ProductItem2
                    img={"/images/home/new1.png"}
                    price={"50.00"}
                    title={"Cordless Drill"}
                    rating={4}
                  />
                  <ProductItem2
                    img={"/images/home/new2.png"}
                    price={"50.00"}
                    title={"Cordless Drill"}
                    rating={5}
                  />
                  <ProductItem2
                    img={"/images/home/new3.png"}
                    price={"50.00"}
                    title={"Usb Cable"}
                    rating={4}
                  />
                  <ProductItem2
                    img={"/images/home/new4.png"}
                    price={"50.00"}
                    title={"Construction Hat"}
                    rating={4}
                  />
                  <ProductItem2
                    img={"/images/home/new5.png"}
                    price={"50.00"}
                    title={"Door Lock"}
                    rating={4}
                  />
                  <ProductItem2
                    img={"/images/home/new6.png"}
                    price={"50.00"}
                    title={"Threaded Fasteners"}
                    rating={4}
                  />
                </>
              )}
            </div>
            <div className="hidden w-[25%] min-h-max bg-[url('/images/home/section-bg3.png')] bg-cover bg-center lg:flex lg:items-end justify-center py-20 px-5">
              <h2 className="text-white font-semibold text-3xl leading-normal ">
                Automatic Digital Equipment
              </h2>
            </div>
          </div>
        </Container1>
      </section>

      {/* Services Section */}
      <section className="min-h-[300px] bg-black mt-[50px] p-10 flex">
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center mx-auto text-white  gap-10 lg:gap-24">
          <ServicesItem
            img="/images/home/service1.png"
            title1={"Fast Free Shipping"}
            title2={"On Orders $50 or More"}
          />
          <ServicesItem
            img="/images/home/service2.png"
            title1={"Best Online Support"}
            title2={"24/7 amazing services"}
          />
          <ServicesItem
            img="/images/home/service3.png"
            title1={"Easy Money Back"}
            title2={"Return With in 30 days"}
          />
          <ServicesItem
            img="/images/home/service4.png"
            title1={"Get 20% Off 1 Item"}
            title2={"When you First sign up"}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-[50px]">
        <Container1
          headingTitle={"Featured Products"}
          HeadingButtonLink={"/shop"}
          headingButtonTitle={"View More Products"}
        >
          <div className="w-full flex">
            <div className="hidden w-[25%] min-h-max bg-[url('/images/home/section-bg4.png')] bg-cover bg-center lg:flex lg:items-start justify-center py-20 px-5">
              <h2 className="text-white font-semibold text-3xl leading-normal ">
                Automatic Digital Equipment
              </h2>
            </div>
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Show actual featured products, fallback to 6 from 6 categories with price > 0 */}
              {(() => {
                let displayProducts = featuredProducts && featuredProducts.length > 0
                  ? featuredProducts.slice(0, 6)
                  : (() => {
                      // Exclude newProducts from featured selection
                      const newProductIds = new Set(newProducts.map(p => p.id));
                      // Only use products not in newProducts
                      const all = [...mostViewedProducts, ...newProducts].filter(p => !newProductIds.has(p.id));
                      // Group by categoryTitleDescription
                      const categoryMap = new Map();
                      for (const p of all) {
                        if (!p.categoryTitleDescription) continue;
                        if (!categoryMap.has(p.categoryTitleDescription)) {
                          categoryMap.set(p.categoryTitleDescription, []);
                        }
                        categoryMap.get(p.categoryTitleDescription).push(p);
                      }
                      // Take product with minimum ID from each unique category (up to 6)
                      const selected = [];
                      for (const products of categoryMap.values()) {
                        if (selected.length >= 6) break;
                        // Sort by ID and take the one with minimum ID
                        const sorted = products.sort((a, b) => {
                          const aId = parseInt(a.id, 10) || 0;
                          const bId = parseInt(b.id, 10) || 0;
                          return aId - bId;
                        });
                        selected.push(sorted[0]);
                      }
                      // If less than 6, fill with any remaining products (unique by id), ensuring NO newProducts are included
                      const usedIds = new Set(selected.map(p => p.id));
                      for (const p of all) {
                        if (selected.length >= 6) break;
                        // Only add if not already used and not in newProducts
                        if (!usedIds.has(p.id) && !newProductIds.has(p.id)) {
                          selected.push(p);
                          usedIds.add(p.id);
                        }
                      }
                      // If still less than 6, fill with any remaining mostViewedProducts (not in newProducts)
                      if (selected.length < 6) {
                        for (const p of mostViewedProducts) {
                          if (selected.length >= 6) break;
                          if (!newProductIds.has(p.id) && !usedIds.has(p.id)) {
                            selected.push(p);
                            usedIds.add(p.id);
                          }
                        }
                      }
                      return selected.slice(0, 6);
                    })();
                return displayProducts.map((product) => (
                  <ProductItem2
                    key={product.id}
                    img={product.itemImage1 || "/images/products/default.png"}
                    price={product.price || "0.00"}
                    title={product.onlineTitleDescription || product.brandName || "Product"}
                    rating={5}
                    link={`/shop/${product.id}`}
                    id={product.id}
                  />
                ));
              })()}
            </div>
          </div>
        </Container1>
      </section>

      {/* Partners Section */}
      <section className="  p-10 flex">
        <div className="w-[80%] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 items-center justify-center mx-auto">
          <img
            src="/images/home/partners/partner1.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
          <img
            src="/images/home/partners/partner2.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
          <img
            src="/images/home/partners/partner3.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
          <img
            src="/images/home/partners/partner4.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
          <img
            src="/images/home/partners/partner5.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
          <img
            src="/images/home/partners/partner6.PNG"
            alt=""
            className="h-[100px] mx-auto"
          />
        </div>
      </section>
    </div>
  );
}
