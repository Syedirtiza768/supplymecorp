import Link from 'next/link'
import React from 'react'

const Container1 = ({children, headingTitle, headingButtonTitle, HeadingButtonLink}) => {
  return (
    <>
        <div className="border-b border-gray1 p-[10px]">
            <div className="w-[80%] mx-auto relative">
                <div className='flex items-center justify-between'>
                  <h3 className="text-2xl font-bold">{headingTitle}</h3>
                  { headingButtonTitle && HeadingButtonLink && (
                    <Link href={HeadingButtonLink} className='bg-first py-3 px-8 rounded-md text-white hover:bg-second'>{headingButtonTitle}</Link>
                  )}
                </div>
                <div className="h-[3px] w-[100px] bg-first absolute bottom-[-12px]"></div>
            </div>        
        </div>
        <div className='w-[80%] mx-auto mt-[20px]'>
            {children}
        </div>
    </>
  )
}

export default Container1