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


      // Fetch customers from local proxy API
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      
      // Handle different response formats (array or object with results)
      // API returns { Customers: [...], ErrorCode: ... }
      const customers = Array.isArray(data) ? data : (data.Customers || data.customers || data.results || data.data || []);
      
      console.log('Total customers:', customers.length);
      console.log('Looking for email:', email);
      
      // Find customer by email (case-insensitive, trim whitespace)
      const customer = customers.find(
        (c) => c.EMAIL_ADRS_1 && c.EMAIL_ADRS_1.trim().toLowerCase() === email.trim().toLowerCase()
      );

      if (!customer) {
        console.error('Customer not found. Searched for:', email);
        console.error('Available emails:', customers.filter(c => c.EMAIL_ADRS_1).map(c => c.EMAIL_ADRS_1).slice(0, 10));
        throw new Error('Customer not found with this email address');
      }
      
      console.log('Found customer:', customer.CUST_NO, customer.NAM);

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
