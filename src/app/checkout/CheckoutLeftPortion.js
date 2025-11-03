import React from 'react'
import ExpressCheckout from './ExpressCheckout'
import CustomFormCheckout from './CustomFormCheckout'

const CheckoutLeftPortion = ({ user, isLoggedIn, submitting, setSubmitting }) => {
  return (
    <div className='w-full h-full lg:w-[50%] overflow-x-auto'>
        {/* Express Checkout */}
        <ExpressCheckout />

        {/* Custom Form Checkout */}
        <CustomFormCheckout 
          user={user}
          isLoggedIn={isLoggedIn}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
    </div>
  )
}

export default CheckoutLeftPortion