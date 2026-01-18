"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { cachedFetch, invalidateCache, mutate } from '@/lib/apiCache';

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
  const fetchingRef = useRef(false); // Prevent duplicate fetches
  const { user } = useAuth();

  // Fetch cart items from backend with caching
  const fetchCart = useCallback(async (skipCache = false) => {
    // Prevent duplicate concurrent fetches (but allow forced refresh)
    if (fetchingRef.current && !skipCache) {
      console.log('⏳ Cart fetch already in progress, skipping');
      return;
    }
    
    // Wait for any pending fetch to complete if we're forcing a refresh
    if (fetchingRef.current && skipCache) {
      console.log('⏳ Waiting for pending fetch to complete before refresh...');
      await new Promise(resolve => {
        const interval = setInterval(() => {
          if (!fetchingRef.current) {
            clearInterval(interval);
            resolve(true);
          }
        }, 50);
      });
    }
    
    fetchingRef.current = true;
    setLoading(true);
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      console.log(`🔍 Fetching cart (skipCache=${skipCache})...`);
      
      const data = await cachedFetch(
        `${apiUrl}/api/cart`,
        { headers: { 'x-session-id': cartKey } },
        { skip: skipCache }
      );
      
      console.log(`📦 Cart fetched: ${data.items?.length || 0} items`);
      setCartItems(data.items || []);
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [user?.custNo]);

  useEffect(() => {
    fetchCart();
    // Re-fetch cart when user changes (login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.custNo]);

  // Add to cart
  const addToCart = useCallback(async (productId, qty = 1) => {
    console.log('🛒 Adding to cart:', { productId, qty, type: typeof productId });
    
    try {
      // Optimistic update - add to UI immediately
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
      
      console.log('📤 Sending cart request:', { url: `${apiUrl}/api/cart/items`, productId: String(productId), qty, sessionId: cartKey });
      
      const result = await mutate(
        `${apiUrl}/api/cart/items`,
        {
          method: 'POST',
          headers: { 'x-session-id': cartKey },
          body: JSON.stringify({ productId: String(productId), qty }),
        },
        ['/api/cart'] // Invalidate cart cache
      );
      
      console.log('✅ Cart API response:', result);
      
      if (!result || !result.ok) {
        throw new Error(result?.error || 'Failed to add to cart');
      }
      
      // Refresh cart with real data (skip cache to get fresh data)
      await fetchCart(true);
      console.log('🔄 Cart refreshed after add');
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      // Rollback optimistic update
      setCartItems(prev => prev.filter(item => !item._optimistic));
      return { success: false, error: error.message };
    }
  }, [user?.custNo, fetchCart]);

  // Update quantity
  const updateQuantity = useCallback(async (productId, qty) => {
    // Optimistic update
    const previousItems = [...cartItems];
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId ? { ...item, qty } : item
      )
    );
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      await mutate(
        `${apiUrl}/api/cart/items/${productId}`,
        {
          method: 'PUT',
          headers: { 'x-session-id': cartKey },
          body: JSON.stringify({ qty }),
        },
        ['/api/cart'] // Invalidate cart cache
      );
      
      // Background refresh (don't await)
      fetchCart(true);
      return { success: true };
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Rollback on error
      setCartItems(previousItems);
      return { success: false, error: error.message };
    }
  }, [cartItems, user?.custNo, fetchCart]);

  // Remove from cart
  const removeFromCart = useCallback(async (productId) => {
    // Optimistic update
    const previousItems = [...cartItems];
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      await mutate(
        `${apiUrl}/api/cart/items/${productId}`,
        {
          method: 'DELETE',
          headers: { 'x-session-id': cartKey },
        },
        ['/api/cart'] // Invalidate cart cache
      );
      
      // Background refresh (don't await)
      fetchCart(true);
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
    // Optimistic update
    const previousItems = [...cartItems];
    setCartItems([]);
    setLoading(true);
    
    try {
      const cartKey = getCartKey(user?.custNo);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      await mutate(
        `${apiUrl}/api/cart`,
        {
          method: 'DELETE',
          headers: { 'x-session-id': cartKey },
        },
        ['/api/cart'] // Invalidate cart cache
      );
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCartItems(previousItems);
      setLoading(false);
      return { success: false, error: error.message };
    }
  }, [cartItems, user?.custNo]);

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
