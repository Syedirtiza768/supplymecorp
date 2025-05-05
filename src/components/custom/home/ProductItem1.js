"use client"

import Rating from "../Rating"

// This component is used in home page for showing products in small size

const ProductItem1 = ({title, price, oldPrice, rating, img, discount}) => {


return (
    <div className="relative min-w-max p-10 flex items-start flex-col ">
        {discount && (
        <div className='absolute top-0'>
            <div className=' bg-red text-white pl-1   text-xs flex items-center justify-center'>
                <span className=''>-{discount}%</span>
                <div className="h-0 w-0 border-t-[12px] border-r-[20px] border-b-[12px] 
                border-solid border-t-transparent border-b-transparent border-l-transparent "></div>
            </div>            
        </div>
        )}
        <img src={img} alt="" className="h-[150px] object-contain" />
        <div className='mt-5 space-y-2'>
            <h3 className='text-gray2'>{title}</h3>
            {/* <div className='space-x-3'>
                { oldPrice && <span className='text-red line-through'>${oldPrice}</span> }
                
                <span className='text-red font-semibold'>${price}</span>
            </div>
            <Rating rating={rating} /> */}
            
        </div>
    </div>
  )
}

export default ProductItem1