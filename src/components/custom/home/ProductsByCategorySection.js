import React from "react";
import Container1 from "@/components/custom/Container1";
import ProductSlider1 from "@/components/custom/sliders/ProductsSlider1";
import { selectedStaticCategories, mergeCategoryWithCounts } from "@/data"; // Import from data.js

// Function to fetch category counts directly from the API
async function getCategoryProductCounts() {
  try {
    // Backend runs on port 3000 with /api prefix
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    const response = await fetch(
      `${apiUrl}/api/products/filters/specific-categories/counts`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
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

  // Use the helper function from data.js to merge static data with API counts
  const sliderData = mergeCategoryWithCounts(categoryCounts);

  return (
    <section className="mt-[50px]">
      <Container1 headingTitle={"Products By Category"}>
        <ProductSlider1 data={sliderData} />
      </Container1>
    </section>
  );
}

export default ProductsByCategorySection;
