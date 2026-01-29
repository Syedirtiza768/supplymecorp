import React from "react";
import Container1 from "@/components/custom/Container1";
import ProductSlider1 from "@/components/custom/sliders/ProductsSlider1";
import { selectedStaticCategories, mergeCategoryWithCounts } from "@/data"; // Import from data.js

// Function to fetch category counts and price info from the API
async function getCategoryProductCounts() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Fetch counts (required)
    const countsResponse = await fetch(
      `${apiUrl}/api/products/filters/specific-categories/counts`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
      }
    );

    if (!countsResponse.ok) {
      console.error("Failed to fetch counts");
      return { counts: null, priceInfo: null };
    }

    const counts = await countsResponse.json();
    
    // Fetch price info (optional - don't fail if this errors)
    let priceInfo = null;
    try {
      const priceInfoResponse = await fetch(
        `${apiUrl}/api/products/filters/specific-categories/price-info`,
        {
          next: { revalidate: 60 },
          headers: { Accept: "application/json" },
        }
      );
      
      if (priceInfoResponse.ok) {
        priceInfo = await priceInfoResponse.json();
      }
    } catch (priceError) {
      console.error("Price info fetch failed, continuing without it:", priceError);
    }

    return { counts, priceInfo };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return { counts: null, priceInfo: null };
  }
}

// Server component
async function ProductsByCategorySection() {
  // Fetch the category counts and price info from the API
  const { counts: categoryCounts, priceInfo } = await getCategoryProductCounts();

  // Use the helper function from data.js to merge static data with API counts
  const sliderData = mergeCategoryWithCounts(categoryCounts, priceInfo);

  return (
    <section className="mt-[50px]">
      <Container1 headingTitle={"Products By Category"}>
        <ProductSlider1 data={sliderData} />
      </Container1>
    </section>
  );
}

export default ProductsByCategorySection;
