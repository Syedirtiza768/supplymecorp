import Link from "next/link";
import React from "react";
import SidebarLink from "./SidebarLink";

import { RiArrowDropDownLine } from "react-icons/ri";

const Sidebar = () => {
  return (
    <div className="w-full h-full flex flex-col p-2 md:p-5">
      <div className="flex flex-col gap-3">
        <SidebarLink linkText={"Building Materials"} linkUrl={"#"} />
        <SidebarLink linkText={"Tools & Hardware"} linkUrl={"#"} />
        <SidebarLink linkText={"Plumbing"} linkUrl={"#"} />
        <SidebarLink linkText={"Electrical"} linkUrl={"#"} />
        <SidebarLink linkText={"Flooring"} linkUrl={"#"} />
        <SidebarLink linkText={"Roofing & Gutters"} linkUrl={"#"} />
        <SidebarLink linkText={"Paint & Decor"} linkUrl={"#"} />
        <SidebarLink linkText={"Safety & Workwear"} linkUrl={"#"} />
        <SidebarLink linkText={"Landscaping & Outdoor"} linkUrl={"#"} />
        <SidebarLink linkText={"HVAC"} linkUrl={"#"} />

        {/* <div className='flex items-center gap-3 text-gray2 font-semibold cursor-pointer'>
              <p>More Categories</p>
              <RiArrowDropDownLine size={30} />
            </div> */}
      </div>

      {/* Filter by Price */}
      <div className="mt-10 flex flex-col gap-5 ">
        <h3 className="text-2xl font-bold border-b border-gray1 pb-3">
          Filter by Price
        </h3>
        <input
          type="range"
          min="1"
          max="100"
          className="range pr-6 accent-second outline-none "
        />
        <button className="self-start bg-second rounded-md text-white py-2 px-5 hover:opacity-80">
          Filter
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
