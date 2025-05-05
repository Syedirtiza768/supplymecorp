"use client";
import { AiOutlineShoppingCart } from 'react-icons/ai';

const LogoWithCircle = ({Logo}) => {
  return (
    <div className='relative'>
        <div className='absolute right-[-4px] top-[-4px] bg-first h-[17px] w-[17px] rounded-full flex items-center justify-center'>
            <span className='text-[12px]'>1</span>
        </div>
        <Logo size={30} />
    </div>
  )
}

export default LogoWithCircle