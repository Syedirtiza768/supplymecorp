import Link from 'next/link'
import { FaList } from 'react-icons/fa';
import { HiViewList } from 'react-icons/hi';

const Container2 = ({children, headingTitle, gridView, setGridView}) => {
  return (
    <>
        <div className="border-b border-gray1 p-[10px]">
            <div className="w-[80%] mx-auto relative">
                <div className='flex items-center gap-16'>
                  <h3 className="text-2xl font-bold">{headingTitle}</h3>                  
                  <div className=' flex items-center gap-2'>
                    <FaList 
                      size={20} 
                      className={`hidden lg:block cursor-pointer ${gridView && 'text-gray2'} `} 
                      onClick={() => setGridView(true) }
                    />
                    <HiViewList 
                      size={20} 
                      className={`hidden lg:block cursor-pointer ${!gridView && 'text-gray2'} `} 
                      onClick={() => setGridView(false) }
                    />
                    <p className='text-gray2 text-sm'>Showing 1-12 of 22 results</p>
                  </div>
                </div>
                <div className="h-[3px] w-[100px] bg-first absolute bottom-[-12px]"></div>
            </div>        
        </div>
        <div className='w-[95%] md:w-[80%] mx-auto mt-[20px]'>
            {children}
        </div>
    </>
  )
}

export default Container2