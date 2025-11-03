import Link from 'next/link'
import React from 'react'

const CheckoutRightPortion = ({ cartItems, submitting }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price_snapshot || item.price || 0) * (item.qty || 1)), 0);
  const taxRate = 0.08875; // NY tax rate, should be configurable
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className='w-full h-full lg:w-[50%] lg:pl-10 '>
        <div className='w-full md:w-[80%] lg:w-[60%] border border-gray1 rounded-md overflow-hidden text-gray2'  >
          <h3 className='p-5 text-xl font-semibold text-black'>Order Summary</h3>
          {/* section 1 */}
          <div className='border-t border-gray1 p-5 gap-3'>
            <p className='text-sm mb-3'>{cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}</p>
            {cartItems.map((item, index) => (
              <div key={index} className='flex items-center mb-4'>
                <img 
                  src={item.image || "/images/products/product1.jpg"} 
                  alt={item.name || 'Product'} 
                  className='w-[80px] h-[80px] object-contain' 
                />
                <div className='w-full px-3'>
                  <p className='text-sm font-semibold'>{item.qty} X {item.name || item.productId}</p>
                  {item.description && <p className='text-xs italic'>{item.description}</p>}
                </div>
                <p className='text-center font-semibold'>
                  ${(parseFloat(item.price_snapshot || item.price || 0) * (item.qty || 1)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          {/* section 2 */}
          <div className='border-t border-gray1 p-5'>
            <div className='flex items-center justify-between font-semibold'>
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className='flex items-center justify-between font-semibold mt-3'>
              <p>Shipping</p>
              <p>TBD</p>
            </div>
            <div className='flex items-center justify-between font-semibold mt-3'>
              <p>Tax (Est.)</p>
              <p>${tax.toFixed(2)}</p>
            </div>
          </div>
          {/* section 3 */}
          <div className='border-t border-gray1 p-5'>
            <div className='flex items-center justify-between font-semibold'>
              <p>Total</p>
              <p className='text-first text-2xl font-bold'>${total.toFixed(2)}</p>
            </div>
          </div>
          
          {submitting && (
            <div className='border-t border-gray1 p-5 bg-blue-50'>
              <p className='text-center text-blue-700'>Processing your order...</p>
            </div>
          )}
        </div>
    </div>
  )
}

export default CheckoutRightPortion