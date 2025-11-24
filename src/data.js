// data.js - Centralized static category data for use across components

// Define the static categories without quantity values
// Quantity will be populated from API calls in components
export const selectedStaticCategories = [
  {
    title: "Building",
    img: "/images/home/categories/building.png",
    link: "/shop?category=Building&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Materials",
    img: "/images/home/categories/materials.jpg",
    link: "/shop?category=Materials&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Tools",
    img: "/images/home/categories/tools.png",
    link: "/shop?category=Tools&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Hardware",
    img: "/images/home/categories/hardware.jpg",
    link: "/shop?category=Hardware&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Plumbing",
    img: "/images/home/categories/plumbing.png",
    link: "/shop?category=Plumbing&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Electrical",
    img: "/images/home/categories/electrical.png",
    link: "/shop?category=Electrical&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Flooring",
    img: "/images/home/categories/flooring.png",
    link: "/shop?category=Flooring&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Roofing",
    img: "/images/home/categories/roofing.png",
    link: "/shop?category=Roofing&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Gutters",
    img: "/images/home/categories/gutters.jpg",
    link: "/shop?category=Gutters&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Paint",
    img: "/images/home/categories/paint.jpg",
    link: "/shop?category=Paint&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Decor",
    img: "/images/home/categories/decor.jpg",
    link: "/shop?category=Decor&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Safety",
    img: "/images/home/categories/safety.jpg",
    link: "/shop?category=Safety&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Workwear",
    img: "/images/home/categories/work-wear.jpg",
    link: "/shop?category=Workwear&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Landscaping",
    img: "/images/home/categories/landscape.jpg",
    link: "/shop?category=Landscaping&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "Outdoor",
    img: "/images/home/categories/outdoor.jpg",
    link: "/shop?category=Outdoor&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
  {
    title: "HVAC",
    img: "/images/home/categories/hvac.jpg",
    link: "/shop?category=HVAC&page=1&limit=10&sortBy=id&sortOrder=DESC",
  },
];
// ...existing code...

// Define category groups for sidebar navigation
export const categoryGroups = {
  "Building Materials": ["Building", "Materials"],
  "Tools & Hardware": ["Tools", "Hardware"],
  Plumbing: ["Plumbing"],
  Electrical: ["Electrical"],
  Flooring: ["Flooring"],
  "Roofing & Gutters": ["Roofing", "Gutters"],
  "Paint & Decor": ["Paint", "Decor"],
  "Safety & Workwear": ["Safety", "Workwear"],
  "Landscaping & Outdoor": ["Landscaping", "Outdoor"],
  HVAC: ["HVAC"],
};

// Get all sidebar categories names
export const getSidebarCategories = () => {
  return Object.keys(categoryGroups);
};

// Helper function to get subcategories for a sidebar category
export const getSubcategoriesForGroup = (groupName) => {
  const subcategoryNames = categoryGroups[groupName] || [];
  return selectedStaticCategories.filter((category) =>
    subcategoryNames.includes(category.title)
  );
};

// Helper function to construct API URL using query parameters
export const constructApiUrl = (
  category,
  page = 1,
  limit = 10,
  sortBy = "id",
  sortOrder = "DESC"
) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/products/filters/by-category/${category}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
};

// Helper function to merge static data with dynamic counts from API
export const mergeCategoryWithCounts = (categoryCounts) => {
  if (!categoryCounts) {
    // Return the static data with default quantity "0" if API call failed
    return selectedStaticCategories.map((category) => ({
      ...category,
      quantity: "0",
    }));
  }

  // Map through static data and add quantities from API response
  return selectedStaticCategories.map((category) => {
    // Get the count from the API response
    const count = categoryCounts[category.title];

    return {
      ...category,
      quantity: count !== undefined ? count.toString() : "0",
    };
  });
};
