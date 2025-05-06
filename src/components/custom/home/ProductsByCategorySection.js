import React from "react";
import Container1 from "@/components/custom/Container1";
import ProductSlider1 from "@/components/custom/sliders/ProductsSlider1";
import { selectedStaticCategories, mergeCategoryWithCounts } from "@/data"; // Import from data.js

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

  // Use the helper function from data.js to merge static data with API counts
  const sliderData = mergeCategoryWithCounts(categoryCounts);

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
