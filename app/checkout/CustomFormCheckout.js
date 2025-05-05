import Link from 'next/link'
import React, { useState } from 'react'

import { MdOutlineLocalShipping } from 'react-icons/md';
import { GiCardPickup } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RiArrowLeftSLine } from 'react-icons/ri';

import SelectList from './SelectList';

const CustomFormCheckout = () => {
  const [country, setCountry] = useState("");
  return (
    <div className='flex flex-col w-full '>      
      {/* Contact Information  */}
      <div className='flex flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-xl'>Contact Information</h3>
          <div className='flex items-center justify-center gap-3'>
            <p className='text-sm text-gray2'>Already have an account?</p>
            <Link href={"#"} className='text-first font-semibold'>Log in</Link>
          </div>
        </div>
        <input 
          type="email"  
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
              className=' outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='First Name'
            />

            <input 
              type="text"  
              className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Last Name'
            />
          </div>

            <input 
              type="text"  
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Company (optional)'
            />
            <input 
              type="text"  
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Address'
            />
            <input 
              type="text"  
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Apartment, suite, stc. (optional)'
            />

            <div className='flex flex-col  gap-3 mt-5 md:flex-row'>
              <input 
                type="text"  
                className=' outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
                placeholder='City'
              />

              <div className='w-full'>
                <SelectList placeholder="Province" />
              </div>

              <input 
                type="text"  
                className='outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
                placeholder='Postal Code'
              />
            </div>
            
            <input 
              type="number"  
              className='mt-5 outline-none border border-gray1 focus:border-second py-3 px-7 rounded-md w-full'
              placeholder='Phone'
            />

            <div className='w-full flex flex-col items-center justify-between mt-5 md:flex-row'>
              <Link href={"/cart"} className='flex items-center'>
                <RiArrowLeftSLine size={30} />
                Return to cart
              </Link>
              <Link href='#' className='bg-second text-white font-semibold py-3 px-5 rounded-md hover:bg-opacity-80'>
                Continue to shopping
              </Link>
            </div>

            <div className='mt-10'></div>
        </div>        
      </div>
    </div>
  )
}

export default CustomFormCheckout