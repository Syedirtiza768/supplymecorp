"use client"

// This component is used in for showing products a single product in the row style
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

const ProductItem3 = ({title, price, oldPrice, rating, img, discount, description, url}) => {

    const router = useRouter();
    const stars = [1,2,3,4,5];


    return (
    <div 
        className="relative w-full min-h-max p-5 flex items-center border border-gray1 gap-10 cursor-pointer" 
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
        <div className='w-[170px]'>
            <img src={img} alt="" className="w-full object-contain" />
        </div>
        <div className='mt-5 w-full'>
            <div className='flex'>
                { stars.map((item) => (
                    item <= rating ? <AiFillStar key={item} className='text-golden' /> : <AiOutlineStar key={item} className='text-golden' />
                )) }
            </div>
            <h3 className='text-gray2'>{title}</h3>
            <div className='space-x-3'>
                { oldPrice && <span className='text-red line-through'>${oldPrice.toFixed(2)}</span> }                
                <span className='text-red font-semibold'>${price}</span>
            </div>
            <p className='text-gray2 py-5'>{description}</p>
        </div>
    </div>
  )
}

export default ProductItem3