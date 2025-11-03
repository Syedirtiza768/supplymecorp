"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

function getCartKey(custNo) {
  // Always use a UUID for the cart key (required by backend)
  if (custNo) {
    // Map CUST_NO to a UUID in localStorage
    const mapKey = 'customerCartMap';
    let map = {};
    try {
      map = JSON.parse(localStorage.getItem(mapKey)) || {};
    } catch {
      map = {};
    }
    if (!map[custNo]) {
      map[custNo] = crypto.randomUUID();
      localStorage.setItem(mapKey, JSON.stringify(map));
    }
    return map[custNo];
  }
  // Guest cart
  let sid = localStorage.getItem('sessionId');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('sessionId', sid);
  }
  return sid;
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items from backend
  const fetchCart = async () => {
    setLoading(true);
    const cartKey = getCartKey(user?.custNo);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
      headers: { 'x-session-id': cartKey },
    });
    const data = await res.json();
    setCartItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    // Re-fetch cart when user changes (login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.custNo]);

  // Add to cart
  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      const cartKey = getCartKey(user?.custNo);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': cartKey,
        },
        body: JSON.stringify({ productId, qty }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, qty) => {
    setLoading(true);
    try {
      const cartKey = getCartKey(user?.custNo);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': cartKey,
        },
        body: JSON.stringify({ qty }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }
      
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const cartKey = getCartKey(user?.custNo);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': cartKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    try {
      const cartKey = getCartKey(user?.custNo);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          'x-session-id': cartKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
      
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity,
      removeFromCart,
      clearCart,
      loading, 
      cartCount: cartItems.reduce((sum, item) => sum + item.qty, 0) 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
