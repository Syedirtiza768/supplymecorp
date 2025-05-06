import Link from "next/link";
import React from "react";
import SidebarLink from "./SidebarLink";

import { RiArrowDropDownLine } from "react-icons/ri";
import { selectedStaticCategories } from "@/data";

const Sidebar = () => {
  return (
    <div className="w-full h-full flex flex-col p-2 md:p-5">
      <div className="flex flex-col gap-2">
        {selectedStaticCategories.map((category) => (
          <SidebarLink
            key={category.title}
            linkText={category.title}
            linkUrl={category.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
