import { BiSolidDownArrow } from 'react-icons/bi';

import Link from 'next/link'
import React from 'react'

const SidebarLink = ({linkText, linkUrl}) => {
  return (
    <div className=' flex items-center gap-3'>
      <Link href={linkUrl} className=' text-gray2 text-sm font-semibold hover:underline  md:text-lg ' >{linkText}</Link>
      <BiSolidDownArrow className='text-gray1 h-[10px]' />
    </div>
  )
}

export default SidebarLink