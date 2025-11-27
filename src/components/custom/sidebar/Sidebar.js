
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SidebarLink from "./SidebarLink";
import { RiArrowDropDownLine } from "react-icons/ri";
import { selectedStaticCategories } from "@/data";

const Sidebar = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/filters/specific-categories/counts`
        );
        if (res.ok) {
          const data = await res.json();
          setCounts(data);
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
        {selectedStaticCategories.map((category) => (
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
