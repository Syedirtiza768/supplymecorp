import React from 'react'

const TableRow = ({productTitle, color, price, quantity}) => {
  return (
    <tr>
        <td className='border border-gray1 text-center w-[120px] '>
            <img src="/images/products/product1.jpg" alt=""  className='h-[100px] w-full object-contain'/>
        </td>
        <td className='py-2 border border-gray1 text-center '>                            
            <p className='text-xl font-semibold'>{productTitle}</p>
            <p className='text-sm italic'>Color {color}</p>
        </td>
        <td className='py-2 border border-gray1 text-center '>${price?.toFixed(2)}</td>
        <td className='py-2 border border-gray1 text-center '>
            <input type="text" value={quantity} readOnly  min={1} max={5} className='w-[50px] bg-white border border-gray1 text-center p-2 outline-none' />
        </td>
        <td className='py-2 border border-gray1 text-center '>${(price * quantity).toFixed(2)}</td>
        <td className='py-2 border border-gray1 text-center '>
            <button 
                className='bg-black text-white py-1 px-5 rounded-sm hover:opacity-80'
                onClick={() => {}}
            >REMOVE</button>
        </td>
    </tr>
  )
}

export default TableRow