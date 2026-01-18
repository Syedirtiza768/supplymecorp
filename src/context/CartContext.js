"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

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
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const res = await fetch(`${apiUrl}/api/cart?t=${Date.now()}`, {
        headers: { 
          'x-session-id': cartKey,
          'Cache-Control': 'no-cache'
        },
      }).catch(err => {
        console.warn('Cart API unavailable:', err.message);
        return null;
      });
      
      if (!res) {
        setCartItems([]);
        return;
      }
      
      if (!res.ok) {
        console.error('Failed to fetch cart:', res.status);
        setCartItems([]);
        return;
      }
      
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [user?.custNo]);

  useEffect(() => {
    fetchCart();
    // Re-fetch cart when user changes (login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.custNo]);

  // Add to cart
  const addToCart = useCallback(async (productId, qty = 1) => {
    try {
      // Optimistic update
      const tempItem = {
        id: `temp-${Date.now()}`,
        productId: String(productId),
        qty,
        product: { id: productId },
        _optimistic: true
      };
      setCartItems(prev => [...prev, tempItem]);
      
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': cartKey,
        },
        body: JSON.stringify({ productId: String(productId), qty }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      // Refresh cart with real data
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Rollback optimistic update
      setCartItems(prev => prev.filter(item => !item._optimistic));
      return { success: false, error: error.message };
    }
  }, [user?.custNo, fetchCart]);

  // Update quantity
  const updateQuantity = useCallback(async (productId, qty) => {
    const previousItems = [...cartItems];
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId ? { ...item, qty } : item
      )
    );
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/cart/items/${productId}`, {
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
      
      // Background refresh
      fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      setCartItems(previousItems);
      return { success: false, error: error.message };
    }
  }, [cartItems, user?.custNo, fetchCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (productId) => {
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/cart/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-session-id': cartKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      
      // Background refresh
      fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Rollback on error
      setCartItems(previousItems);
      return { success: false, error: error.message };
    }
  }, [cartItems, user?.custNo, fetchCart]);

  // Clear cart
  const clearCart = useCallback(async () => {
    const previousItems = [...cartItems];
    setCartItems([]);
    setLoading(true);
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/cart`, {
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
      setCartItems(previousItems);
      setLoading(false);
      return { success: false, error: error.message };
    }
  }, [cartItems, user?.custNo, fetchCart]);

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
