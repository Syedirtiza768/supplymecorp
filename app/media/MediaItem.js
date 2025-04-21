import React from 'react'

const MediaItem = ({img}) => {
  return (
    <div className=" h-[300px] ">
        <img src={img} alt="" className="h-full w-full object-cover object-center" />
    </div>
  )
}

export default MediaItem