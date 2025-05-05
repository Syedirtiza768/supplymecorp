import Link from 'next/link'
import React from 'react'

const CheckoutRightPortion = () => {
  return (
    <div className='w-full h-full lg:w-[50%] lg:pl-10 '>
        <div className='w-full md:w-[80%] lg:w-[60%] border border-gray1 rounded-md overflow-hidden text-gray2'  >
          <h3 className='p-5 text-xl font-semibold text-black'>Order Summary</h3>
          {/* section 1 */}
          <div className='border-t border-gray1 p-5 gap-3'>
            <p className='text-sm'>1 Item</p>
            <div className='flex items-center'>
              <img src="/images/products/product1.jpg" alt="" className='w-[80px] h-[80px] object-contain' />
              <div className='w-full text-center'>
                <p className='text-sm font-semibold'>1 X IMPACT WRENCH</p>
                <p className='text-sm  italic'>Color red</p>
              </div>
              <p className='text-center '>$99.00</p>
            </div>
          </div>
          {/* section 2 */}
          <div className='border-t border-gray1 p-5'>
            <div className='flex items-center justify-between font-semibold'>
              <p>Subtotal</p>
              <p>$99.00</p>
            </div>
            <div className='flex items-center justify-between font-semibold mt-3'>
              <p>Shipping</p>
              <p>--</p>
            </div>
            <div className='flex items-center justify-between font-semibold mt-3'>
              <p>Tax</p>
              <p>$2.00</p>
            </div>
          </div>
          {/* section 3 */}
          <div className='border-t border-gray1 p-5'>
            <div className='flex items-center justify-between font-semibold'>
              <p>Total</p>
              <p className='text-first text-2xl font-bold'>$101.00</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CheckoutRightPortion