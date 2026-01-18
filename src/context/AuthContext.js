"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Validate password
      if (password !== 'testpwd1') {
        throw new Error('Invalid password');
      }

      // Fetch customer by email using query parameter (much faster than loading all 599)
      // Using relative URL ensures it works regardless of which port we're on
      console.log('🔍 Fetching customer for email:', email);
      const startTime = performance.now();
      
      const response = await fetch(`/api/customers?email=${encodeURIComponent(email)}`, {
        cache: 'no-store', // Prevent caching issues
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      const fetchTime = Math.round(performance.now() - startTime);
      console.log('📡 API Response status:', response.status, response.ok ? '✓' : '✗', `(${fetchTime}ms)`);
      
      if (!response.ok) {
        let errorData = {};
        let errorText = '';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorText = await response.text();
          }
        } catch (parseError) {
          errorText = 'Unable to parse error response';
          console.error('Error parsing API response:', parseError);
        }
        
        console.error('❌ Customer API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText: errorText.substring(0, 200),
        });
        
        const errorMessage = errorData.error || errorData.details || errorText || 
          `Failed to fetch customers (HTTP ${response.status})`;
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ API Response received');
      
      // Handle different response formats
      // Email query returns { Customers: [single customer], ErrorCode: ... }
      const customers = Array.isArray(data) ? data : (data.Customers || data.customers || data.results || data.data || []);
      
      if (!Array.isArray(customers) || customers.length === 0) {
        console.error('❌ No customers found in response');
        throw new Error('Customer not found with this email address');
      }
      
      // Should only be one customer when querying by email
      const customer = customers[0];
      console.log('✓ Found customer:', customer.CUST_NO, customer.NAM);

      // Create user object with customer data
      const userData = {
        email: customer.EMAIL_ADRS_1,
        name: customer.NAM,
        custNo: customer.CUST_NO,
        firstName: customer.FST_NAM || '',
        lastName: customer.LST_NAM || '',
        phone: customer.PHONE_1 || '',
        address: customer.ADDR_1 || '',
        city: customer.CITY || '',
        state: customer.STATE || '',
        zip: customer.ZIP_COD || '',
      };

      // Store user in state and localStorage
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
