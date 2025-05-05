import React from 'react'

const ServicesItem = ({img, title1, title2}) => {
  return (
    <div className="flex flex-col items-center justify-center">
        <div className="bg-[#D9D9D9] bg-opacity-40 rounded-full h-[70px] w-[70px] flex items-center justify-center ">
          <img src={img} alt="" className='h-[60px] object-contain' />
        </div>
        <h3 className="mt-3 font-semibold">{title1}</h3>
        <p className="text-sm">{title2}</p>
    </div>
  )
}

export default ServicesItem