import { BiSolidDownArrow } from "react-icons/bi";

import Link from "next/link";
import React from "react";

const SidebarLink = ({ linkText, linkUrl }) => {
  return (
    <div className="">
      <Link
        href={linkUrl}
        className=" text-gray2 text-sm font-semibold hover:underline  md:text-[16px] "
      >
        {linkText}
      </Link>
    </div>
  );
};

export default SidebarLink;
