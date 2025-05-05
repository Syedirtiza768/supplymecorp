import Link from 'next/link'
import React from 'react'

const SimpleNavbarItem = ({mobileNavbar, title, link}) => {
  return (
    <Link 
        href={link} 
        className={`p-2 border-t-2 mt-[-1px] border-transparent hover:border-second hover:text-second 
                    ${mobileNavbar && 'w-[50%] text-center'}`}
        >
            {title}
        </Link>            
  )
}

export default SimpleNavbarItem