import React from 'react'
import ExpressCheckout from './ExpressCheckout'
import CustomFormCheckout from './CustomFormCheckout'

const CheckoutLeftPortion = () => {
  return (
    <div className='w-full h-full lg:w-[50%] overflow-x-auto'>
        {/* Express Checkout */}
        <ExpressCheckout />

        {/* Custom Form Checkout */}
        <CustomFormCheckout />
    </div>
  )
}

export default CheckoutLeftPortion