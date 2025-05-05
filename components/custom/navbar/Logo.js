"use client";

import Image from "next/image";

const Logo = ({ navbar, setNavbar }) => {
  return (
    <div className="flex items-center justify-between ">
      <img src="/images/logo.png" alt="" className="h-[100px] lg:h-[140px]" />
    </div>
  );
};

export default Logo;
