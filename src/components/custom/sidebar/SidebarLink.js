import { BiSolidDownArrow } from "react-icons/bi";

import Link from "next/link";
import React from "react";


const SidebarLink = ({ linkText, linkUrl, count }) => {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={linkUrl}
        className="text-gray2 text-sm font-semibold hover:underline md:text-[16px]"
      >
        {linkText}
      </Link>
      <span className="ml-2 text-xs text-gray-500">{count}</span>
    </div>
  );
};

export default SidebarLink;
