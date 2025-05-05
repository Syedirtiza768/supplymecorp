import Link from "next/link";
import Container1 from "@/components/custom/Container1";
import ProductSlider1 from "@/components/custom/sliders/ProductsSlider1";
import ProductItem1 from "@/components/custom/home/ProductItem1";
import Card1Item from "@/components/custom/home/Card1Item";
import ProductItem2 from "@/components/custom/home/ProductItem2";
import MyFlipBook from "@/components/custom/MyFlipBook";
import { LiaShippingFastSolid } from "react-icons/lia";
import ServicesItem from "@/components/custom/home/ServicesItem";

export default function Home() {
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
      <section className="container mt-[50px]">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-center">
            2025 Catalog: <span className="text-primary">Spring & Summer</span>
          </h2>
          <MyFlipBook />
        </div>
      </section>
      {/* PRoducts By Category Section */}
      <section className="mt-[50px]">
        <Container1 headingTitle={"Products By Category"}>
          <ProductSlider1
            data={[
              {
                title: "Building Materials",
                img: "/images/home/categories/category1.png",
                quantity: "120",
                link: "#",
              },
              {
                title: "Tools & Hardware",
                img: "/images/home/categories/category2.png",
                quantity: "20",
                link: "#",
              },
              {
                title: "Plumbing",
                img: "/images/home/categories/category3.png",
                quantity: "28",
                link: "#",
              },
              {
                title: "Electrical",
                img: "/images/home/categories/category4.png",
                quantity: "20",
                link: "#",
              },
              {
                title: "Flooring",
                img: "/images/home/categories/category5.png",
                quantity: "8",
                link: "#",
              },
              {
                title: "Roofing & Gutters",
                img: "/images/home/categories/category6.png",
                quantity: "22",
                link: "#",
              },
            ]}
          />
        </Container1>
      </section>

      {/* Most Viewed Products Section */}
      <section className="mt-[50px]">
        <Container1 headingTitle={"Most Viewed Products"}>
          <div className="flex items-center justify-start gap-10 w-full overflow-x-auto">
            <ProductItem1
              img={"/images/home/deal1.png"}
              title={"Cordless Drill"}
            />
            <ProductItem1
              img={"/images/home/deal2.png"}
              price={"280.00"}
              oldPrice={"400.00"}
              title={"Glue Gun"}
              rating={5}
              discount={"18"}
            />
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
          HeadingButtonLink={"#"}
          headingButtonTitle={"View More Products"}
        >
          <div className="w-full flex">
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          HeadingButtonLink={"#"}
          headingButtonTitle={"View More Products"}
        >
          <div className="w-full flex">
            <div className="hidden w-[25%] min-h-max bg-[url('/images/home/section-bg4.png')] bg-cover bg-center lg:flex lg:items-start justify-center py-20 px-5">
              <h2 className="text-white font-semibold text-3xl leading-normal ">
                Automatic Digital Equipment
              </h2>
            </div>
            <div className="w-full lg:w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <ProductItem2
                img={"/images/home/featured1.png"}
                price={"50.00"}
                title={"Drill Drivers"}
                rating={5}
              />
              <ProductItem2
                img={"/images/home/featured2.png"}
                price={"50.00"}
                title={"Poundland Hammer"}
                rating={4}
              />
              <ProductItem2
                img={"/images/home/featured3.png"}
                price={"50.00"}
                title={"Painting Brush"}
                rating={4}
              />
              <ProductItem2
                img={"/images/home/featured4.png"}
                price={"50.00"}
                title={"Glue Gun"}
                rating={5}
              />
              <ProductItem2
                img={"/images/home/featured5.png"}
                price={"50.00"}
                title={"Screw"}
                rating={5}
              />
              <ProductItem2
                img={"/images/home/featured6.png"}
                price={"50.00"}
                title={"Mop"}
                rating={4}
              />
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
