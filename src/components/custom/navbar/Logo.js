"use client";

import Image from "next/image";

const Logo = ({ navbar, setNavbar }) => {
  return (
    <div className="flex items-center justify-between ">
      <Image
        src="/images/logo.png"
        alt="RR General Supply Logo"
        width={280}
        height={140}
        priority
        className="h-[100px] lg:h-[140px] w-auto"
        sizes="(max-width: 1024px) 200px, 280px"
      />
    </div>
  );
};

export default Logo;
