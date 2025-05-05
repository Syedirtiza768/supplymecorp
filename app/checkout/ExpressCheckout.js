import React from 'react'

const ExpressCheckout = () => {
  return (
    <div className=''>
        {/* Express Checkout line */}
        <div className=' flex items-center justify-center w-full gap-5'>
            <div className='h-[1px] bg-gray1 w-[40%] '></div>
            <h3 className='text-center w-[20%] text-gray2 font-semibold'>Express Checkout</h3>
            <div className='h-[1px] bg-gray1 w-[40%] '></div>            
        </div>
        {/* Payment Buttons */}
        <div className='p-5 flex flex-col md:flex-row gap-5'>
          <button 
            onClick={() => {}}
            className='h-[50px] w-full bg-white border border-[#592ff4] hover:scale-105 transition rounded-md flex items-center justify-center'
          > 
            <img src="/images/icons/shop-pay.png" className='h-[25px] object-contain ' alt="" /> 
          </button>
          <button 
            onClick={() => {}}
            className='h-[50px] w-full bg-white border border-[#592ff4] hover:scale-105 transition rounded-md flex items-center justify-center'
          > 
            <img src="/images/icons/g-pay.png" className='h-[25px] object-contain ' alt="" /> 
          </button>
        </div>
        {/* OR line */}
        <div className=' flex items-center justify-center w-full gap-5'>
            <div className='h-[1px] bg-gray1 w-[45%] '></div>
            <h3 className='text-center w-[10%] text-gray2 font-semibold'>OR</h3>
            <div className='h-[1px] bg-gray1 w-[45%] '></div>            
        </div>        
    </div>
  )
}

export default ExpressCheckout