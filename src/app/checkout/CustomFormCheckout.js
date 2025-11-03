'use client';
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

import { MdOutlineLocalShipping } from 'react-icons/md';
import { GiCardPickup } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RiArrowLeftSLine } from 'react-icons/ri';

import SelectList from './SelectList';

const CustomFormCheckout = ({ submitting, setSubmitting }) => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  
  const [country, setCountry] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("ship");
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: '',
    address: user?.address || '',
    apartment: '',
    city: user?.city || '',
    province: user?.state || '',
    postalCode: user?.zip || '',
    phone: user?.phone || '',
    specialInstructions: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setError('Please log in to place an order');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        customer: {
          custNo: user.custNo,
          email: formData.email || user.email,
          firstName: formData.firstName || user.firstName,
          lastName: formData.lastName || user.lastName,
          address: formData.address || user.address,
          city: formData.city || user.city,
          state: formData.province || user.state,
          zip: formData.postalCode || user.zip,
          phone: formData.phone || user.phone
        },
        cartItems: cartItems,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          address2: formData.apartment,
          city: formData.city,
          state: formData.province,
          zip: formData.postalCode,
          phone: formData.phone
        },
        specialInstructions: formData.specialInstructions,
        deliveryMethod: deliveryMethod
      };

      const response = await fetch('/api/orders/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Clear the cart
        await clearCart();
        
        // Redirect to confirmation page
        router.push(`/checkout/confirmation?orderId=${result.orderId}&orderNumber=${result.orderNumber}`);
      } else {
        setError(result.error || result.message || 'Failed to submit order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Unable to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmitOrder} className='flex flex-col w-full '>
      {error && (
        <div className='bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-5'>
          {error}
        </div>
      )}
      
      {/* Contact Information  */}
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-xl'>Contact Information</h3>
          {!isLoggedIn && (
            <div className='flex items-center justify-center gap-3'>
              <p className='text-sm text-gray2'>Already have an account?</p>
              <Link href={"/auth/login"} className='text-first font-semibold'>Log in</Link>
            </div>
          )}
        </div>
        <input 
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={submitting}
          className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md'
          placeholder='Email'
        />
        <div className='flex items-center gap-3'>
          <input type="checkbox" id='emailOffers' className='accent-second w-5 h-5' />
          <label htmlFor="emailOffers" className='text-gray2'>Email me with news and offers</label>
        </div>
      </div>

      {/* Delivery Method  */}
      <div className='flex flex-col mt-10 '>
        <h3 className='font-semibold text-xl'>Delivery Method</h3>                  
        <div className='flex  items-center gap-4  border border-gray1 p-5 mt-3 rounded-t-md'>
          <input 
            type="radio" 
            name='delivery_method' 
            value={"ship"} 
            id='ship'
            checked={deliveryMethod === "ship"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            disabled={submitting}
            className='h-5 w-5 accent-second' />
          
          <MdOutlineLocalShipping size={23} />
          <label htmlFor="ship" className='text-gray2'>Ship</label>
        </div>
        <div className='flex  items-center gap-4  border border-t-0 border-gray1 p-5 rounded-b-md'>
          <input 
            type="radio" 
            name='delivery_method' 
            value={"pickup"} 
            id='pickup'
            checked={deliveryMethod === "pickup"}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            disabled={submitting}
            className='h-5 w-5 accent-second' />
          
          <GiCardPickup size={23} />
          <label htmlFor="pickup" className='text-gray2'>Pick up</label>
        </div>

        
        
      </div>

      {/* Shipping Address */}
      <div className='flex flex-col gap-5 mt-10'>
        <h3 className='font-semibold text-xl'>Shipping Address</h3>       
        <div className='w-full '>
          <SelectList placeholder="Select Country..." />

          <div className='flex flex-col  gap-5 mt-5 md:flex-row'>
            <input 
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className=' outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='First Name'
            />

            <input 
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Last Name'
            />
          </div>

            <input 
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              disabled={submitting}
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Company (optional)'
            />
            <input 
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Address'
            />
            <input 
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleInputChange}
              disabled={submitting}
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Apartment, suite, etc. (optional)'
            />

            <div className='flex flex-col  gap-3 mt-5 md:flex-row'>
              <input 
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className=' outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
                placeholder='City'
              />

              <input 
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
                placeholder='State/Province'
              />

              <input 
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
                disabled={submitting}
                className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
                placeholder='Postal Code'
              />
            </div>
            
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Phone'
            />
            
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              disabled={submitting}
              rows={3}
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Special instructions (optional)'
            />

            <div className='w-full flex flex-col items-center justify-between mt-5 md:flex-row'>
              <Link href={"/cart"} className='flex items-center'>
                <RiArrowLeftSLine size={30} />
                Return to cart
              </Link>
              <button 
                type='submit' 
                disabled={submitting || !isLoggedIn}
                className='bg-second text-white font-semibold py-3 px-5 rounded-md hover:bg-opacity-80 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {submitting ? 'Submitting Order...' : 'Place Order'}
              </button>
            </div>

            <div className='mt-10'></div>
        </div>        
      </div>
    </form>
  )
}

export default CustomFormCheckout