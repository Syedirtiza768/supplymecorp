"use client";

import { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import CartIcon from "./CartIcon";
import Link from "next/link";
import MobileSearch from "./MobileSearch";
import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const RightItems = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="cursor-pointer flex items-center justify-center gap-5 md:gap-10">
      <MobileSearch />

      <div className="flex items-center justify-center gap-5">
        <Link href="/wishlist">
          <AiOutlineHeart size={30} color="#fff" />
        </Link>
        <CartIcon color="#fff" />
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
              <AvatarFallback>
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="font-semibold">
              {user?.name || user?.firstName || 'User'}
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="text-xs text-gray-500">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default RightItems;
