import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const CartIcon = ({ color = "#fff" }) => {
  const { cartCount } = useCart();
  return (
    <Link href="/cart" className="relative">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M6 6h15l-1.5 9h-13z" stroke={color} strokeWidth="2"/>
        <circle cx="9" cy="21" r="1" fill={color}/>
        <circle cx="18" cy="21" r="1" fill={color}/>
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
