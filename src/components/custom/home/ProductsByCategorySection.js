import React from "react";
import Container1 from "@/components/custom/Container1";
import ProductSlider1 from "@/components/custom/sliders/ProductsSlider1";

// Function to fetch category counts directly from the API
async function getCategoryProductCounts() {
  try {
    // Make sure API URL is correct
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    console.log("Using API URL:", apiUrl);

    // Explicitly include credentials and disable cache
    const response = await fetch(
      `${apiUrl}/products/filters/specific-categories/counts`,
      {
        cache: "no-store", // Important: Disable Next.js cache completely
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "API response not OK:",
        response.status,
        response.statusText
      );
      throw new Error(
        `Failed to fetch category counts: ${response.status} ${response.statusText}`
      );
    }

    // Parse response
    const data = await response.json();
    console.log("Raw API response:", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error fetching category counts:", error);
    return null;
  }
}

// Server component
async function ProductsByCategorySection() {
  // Fetch the category counts from the API
  const categoryCounts = await getCategoryProductCounts();
  console.log("Category counts from API:", categoryCounts);

  // Define your static categories data structure
  const staticData = [
    {
      title: "Building",
      img: "/images/home/categories/building.png",
      quantity: "120",
      link: "/products?category=Building",
    },
    {
      title: "Materials",
      img: "/images/home/categories/materials.jpg",
      quantity: "120",
      link: "/products?category=Materials",
    },
    {
      title: "Tools",
      img: "/images/home/categories/tools.png",
      quantity: "20",
      link: "/products?category=Tools",
    },
    {
      title: "Hardware",
      img: "/images/home/categories/hardware.jpg",
      quantity: "20",
      link: "/products?category=Hardware",
    },
    {
      title: "Plumbing",
      img: "/images/home/categories/plumbing.png",
      quantity: "28",
      link: "/products?category=Plumbing",
    },
    {
      title: "Electrical",
      img: "/images/home/categories/electrical.png",
      quantity: "20",
      link: "/products?category=Electrical",
    },
    {
      title: "Flooring",
      img: "/images/home/categories/flooring.png",
      quantity: "8",
      link: "/products?category=Flooring",
    },
    {
      title: "Roofing",
      img: "/images/home/categories/roofing.png",
      quantity: "22",
      link: "/products?category=Roofing",
    },
    {
      title: "Gutters",
      img: "/images/home/categories/gutters.jpg",
      quantity: "22",
      link: "/products?category=Gutters",
    },
    {
      title: "Paint",
      img: "/images/home/categories/paint.jpg",
      quantity: "22",
      link: "/products?category=Paint",
    },
    {
      title: "Decor",
      img: "/images/home/categories/decor.jpg",
      quantity: "22",
      link: "/products?category=Decor",
    },
    {
      title: "Safety",
      img: "/images/home/categories/safety.jpg",
      quantity: "22",
      link: "/products?category=Safety",
    },
    {
      title: "Workwear",
      img: "/images/home/categories/work-wear.jpg",
      quantity: "22",
      link: "/products?category=Workwear",
    },
    {
      title: "Landscaping",
      img: "/images/home/categories/landscape.jpg",
      quantity: "22",
      link: "/products?category=Landscaping",
    },
    {
      title: "Outdoor",
      img: "/images/home/categories/outdoor.jpg",
      quantity: "22",
      link: "/products?category=Outdoor",
    },
    {
      title: "HVAC",
      img: "/images/home/categories/hvac.jpg",
      quantity: "22",
      link: "/products?category=HVAC",
    },
  ];

  // Update the slider data with the counts from the API
  let sliderData;
  if (categoryCounts) {
    sliderData = staticData.map((category) => {
      // Get the count from the API response
      const count = categoryCounts[category.title];

      // Log each mapping for debugging
      console.log(`Category: ${category.title}, API Count: ${count}`);

      return {
        ...category,
        quantity: count !== undefined ? count.toString() : "0",
      };
    });
  } else {
    // Fallback to static data if API call failed
    sliderData = staticData;
  }

  console.log(
    "Final slider data:",
    sliderData.map((item) => `${item.title}: ${item.quantity}`)
  );

  return (
    <section className="mt-[50px]">
      <Container1 headingTitle={"Products By Category"}>
        <ProductSlider1 data={sliderData} />
      </Container1>
    </section>
  );
}

export default ProductsByCategorySection;
