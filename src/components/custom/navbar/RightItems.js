"use client";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import LogoWithCircle from "./LogoWithCircle";
import Link from "next/link";
import MobileSearch from "./MobileSearch";

const RightItems = () => {
  return (
    <div className="cursor-pointer flex items-center justify-center gap-5 md:gap-10">
      <MobileSearch /> {/* Add this for mobile search */}
      <Link
        href={"/auth/login"}
        className="hidden md:flex items-center justify-center gap-2"
      >
        <IoPersonOutline size={30} />
        <span>Login</span>
      </Link>
      <div className="flex items-center justify-center gap-5">
        <Link href={"/wishlist"}>
          <AiOutlineHeart size={30} />
        </Link>
        <Link href={"/cart"}>
          <LogoWithCircle Logo={AiOutlineShoppingCart} />
        </Link>
      </div>
    </div>
  );
};

export default RightItems;
