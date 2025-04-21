"use client"
// This component is used in home and shop page for showing products in large size

import { useRouter } from 'next/navigation';
import Rating from '../Rating';

const ProductItem2 = ({title, price, oldPrice, rating, img, discount, url}) => {

    const router = useRouter();

    return (
    <div 
        className="relative w-full min-h-max p-5 flex items-center flex-col border border-gray1 cursor-pointer"
        onClick={() => router.push("/shop/" + "1")}
    >        
        {discount && (
        <div className='absolute top-0 left-0'>
            <div className=' bg-red text-white pl-1   text-xs flex items-center justify-center'>
                <span className=''>-{discount}%</span>
                <div className="h-0 w-0 border-t-[12px] border-r-[20px] border-b-[12px] 
                border-solid border-t-transparent border-b-transparent border-l-transparent "></div>
            </div>            
        </div>
        )}
        <img src={img} alt="" className="h-[140px] object-contain" />
        <div className='mt-5 w-full'>
            
            <h3 className='text-gray2 text-center mt-8'>{title}</h3>
            {/* <div className='space-x-3'>
                { oldPrice && <span className='text-red line-through'>${oldPrice.toFixed(2)}</span> }                
                <span className='text-red font-semibold'>${price}</span>
            </div>
            <Rating rating={rating} />             */}
        </div>
    </div>
  )
}

export default ProductItem2