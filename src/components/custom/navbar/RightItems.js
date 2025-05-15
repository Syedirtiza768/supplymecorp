"use client";

import { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import LogoWithCircle from "./LogoWithCircle";
import Link from "next/link";
import MobileSearch from "./MobileSearch";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RightItems = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace this with real auth check

  return (
    <div className="cursor-pointer flex items-center justify-center gap-5 md:gap-10">
      <MobileSearch />

      <div className="flex items-center justify-center gap-5">
        <Link href="/wishlist">
          <AiOutlineHeart size={30} />
        </Link>
        <Link href="/cart">
          <LogoWithCircle Logo={AiOutlineShoppingCart} />
        </Link>
      </div>

      {!isLoggedIn ? (
        <Link
          href="/auth/login"
          className="hidden md:flex items-center justify-center gap-2"
        >
          <IoPersonOutline size={30} />
          <span>Login</span>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hidden md:flex cursor-pointer">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={
                () => setIsLoggedIn(false) // Replace with logout logic later
              }
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default RightItems;
