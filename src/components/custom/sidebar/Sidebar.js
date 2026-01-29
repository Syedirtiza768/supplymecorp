
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { RiArrowDropDownLine } from "react-icons/ri";
import { selectedStaticCategories } from "@/data";

const Sidebar = () => {
  const [counts, setCounts] = useState({});
  const [sortedCategories, setSortedCategories] = useState(selectedStaticCategories);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/filters/specific-categories/counts`
        );
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
          
          // Sort categories: those with count > 0 first, then those with count = 0
          const sorted = [...selectedStaticCategories].sort((a, b) => {
            const countA = data[a.title] || 0;
            const countB = data[b.title] || 0;
            
            // Categories with items come first
            if (countA > 0 && countB === 0) return -1;
            if (countA === 0 && countB > 0) return 1;
            
            // Maintain original order within same category
            return 0;
          });
          setSortedCategories(sorted);
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
