"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import RightItems from "./RightItems";
import Image from "next/image";
import Link from "next/link";
import SimpleNavbarItem from "./SimpleNavbarItem";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setMobileNavbar(false);
  }, [path]);

  return (
    <div
      className={` w-full bg-black  text-white flex flex-col items-center justify-start 
                    ${mobileNavbar && "h-screen fixed z-50"} `}
    >
      {/* Navbar Header */}
      <div
        className={`w-[95%] mx-auto min-h-[120px] flex items-center justify-center 
                        lg:w-[80%]
                        `}
      >
        <div className="flex items-center justify-between w-full  pt-2">
          <Logo />
          <SearchBar />
          <RightItems />
          {/* For Mobile Menu */}
          <div className="md:hidden">
            <button
              className="p-2 text-gray-700 rounded-md outline-none "
              onClick={() => setMobileNavbar(!mobileNavbar)}
            >
              {mobileNavbar ? (
                <Image
                  src="/images/cross-icon.jpg"
                  width={40}
                  height={40}
                  alt="logo"
                />
              ) : (
                <Image
                  src="/images/hamburgere-icon.jpg"
                  width={40}
                  height={40}
                  alt="logo"
                  className="focus:border-none active:border-none"
                />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Navbar Menu */}
      <div
        className={`w-full border-t border-gray1 mt-5 h-full flex-1 
                        ${mobileNavbar ? "block" : "hidden"} md:block`}
      >
        <div
          className={`w-[95%] mx-auto flex flex-col items-center justify-between gap-5 h-full  
                        lg:w-[80%] md:flex-row                        
                        `}
        >
          <div
            className={`h-full flex gap-5 
                            ${
                              mobileNavbar
                                ? "items-center justify-center flex-col w-full"
                                : "items-start justify-start flex-row"
                            }`}
          >
            <SimpleNavbarItem
              mobileNavbar={mobileNavbar}
              title="Home"
              link="/"
            />
            <SimpleNavbarItem
              mobileNavbar={mobileNavbar}
              title="Shop"
              link="/shop?category=Tools&page=1&limit=10&sortBy=id&sortOrder=DESC"
            />
            <SimpleNavbarItem
              mobileNavbar={mobileNavbar}
              title="Media"
              link="/media"
            />
            <SimpleNavbarItem
              mobileNavbar={mobileNavbar}
              title="About Us"
              link="/about"
            />
            <SimpleNavbarItem
              mobileNavbar={mobileNavbar}
              title="Contact Us"
              link="/contact"
            />
          </div>
          <div>
            <p>Call Us : (718) 278-8480</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
