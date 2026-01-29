
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { RiArrowDropDownLine } from "react-icons/ri";
import { selectedStaticCategories } from "@/data";

const Sidebar = () => {
  const [counts, setCounts] = useState({});
  const [sortedCategories, setSortedCategories] = useState(
    selectedStaticCategories.filter(
      category => category.title !== 'Building' && category.title !== 'Materials' && category.title !== 'Workwear'
    )
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const countsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/filters/specific-categories/counts`
        );
        
        if (countsRes.ok) {
          const countsData = await countsRes.json();
          setCounts(countsData);
          
          // Filter out Building, Materials, and Workwear
          const filtered = selectedStaticCategories.filter(
            category => category.title !== 'Building' && category.title !== 'Materials' && category.title !== 'Workwear'
          );
          
          // Try to fetch price info for sorting, but don't fail if it errors
          try {
            const priceInfoRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/products/filters/specific-categories/price-info`
            );
            
            if (priceInfoRes.ok) {
              const priceInfoData = await priceInfoRes.json();
              
              const sorted = [...filtered].sort((a, b) => {
                const priceInfoA = priceInfoData[a.title] || { withPrice: 0 };
                const priceInfoB = priceInfoData[b.title] || { withPrice: 0 };
                
                // Categories with priced items come first
                if (priceInfoA.withPrice > 0 && priceInfoB.withPrice === 0) return -1;
                if (priceInfoA.withPrice === 0 && priceInfoB.withPrice > 0) return 1;
                
                // Maintain original order within same category
                return 0;
              });
              setSortedCategories(sorted);
            } else {
              setSortedCategories(filtered);
            }
          } catch (priceErr) {
            // If price info fails, just use filtered categories without sorting
            setSortedCategories(filtered);
          }
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-2 md:p-5">
      <div className="flex flex-col gap-2">
        {sortedCategories.map((category) => (
          <SidebarLink
            key={category.title}
            linkText={category.title}
            linkUrl={category.link}
            count={counts[category.title] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
