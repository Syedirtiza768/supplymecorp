import Link from 'next/link'
import React from 'react'

const Card1Item = ({img, title1, title2, link}) => {
  return (
    <div className={` ${title2 === "Drill Drivers" ? "bg-[url('/images/home/section-bg1.png')]" : "bg-[url('/images/home/section-bg2.png')]"}   h-full w-full  rounded-md text-white flex flex-col px-16 py-5 items-start justify-center`}>
        <span className="text-2xl font-semibold">{title1}</span>
        <span className="text-2xl font-semibold">{title2}</span>
        <Link href={link} className="underline font-semibold text-xl mt-5 hover:opacity-80">View Products</Link>
    </div>
  )
}

export default Card1Item