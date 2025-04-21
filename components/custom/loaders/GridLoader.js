"use client"
import GridLoader from 'react-spinners/GridLoader'

const GridLoaderSpinners = () => {
  return (
    <div className='fixed top-0 left-0 bg-black/20 z-50 flex items-center justify-center w-full h-screen'>
        <GridLoader color="#d4a201"  />
    </div>
  )
}

export default GridLoaderSpinners