import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';

const ItemNotSeleted = () => {
  return (
    <div className="h-[200px] flex items-end justify-center">
        <div className="flex flex-col items-center justify-center gap-5">
            <p className="text-gray2 font-semibold">Your cart is currently empty</p>
            <Link 
                href={"/shop"}
                className="bg-black text-white py-1 px-5 rounded-sm hover:opacity-80 flex items-center gap-3"
            >
                CONTINUE SHOPPING
                <BsArrowRight size={20} />
            </Link>
        </div>
    </div>
  )
}

export default ItemNotSeleted