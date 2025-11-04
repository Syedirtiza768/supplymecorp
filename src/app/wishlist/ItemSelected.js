"use client";
import React from "react";
import TableRow from './TableRow';

const ItemSelected = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="w-[100%] min-h-[450px] flex items-center justify-center">
        <p className="text-gray-500">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className='w-[100%] min-h-[450px]'>
        <div className='w-full h-full overflow-x-auto flex items-center justify-center'>
            <table className='w-[800px]'>
                <thead>
                    <tr>
                        <td className='border border-gray1 text-center font-semibold'></td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Product</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Price</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Stock</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Actions</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'></td>
                    </tr>
                </thead>
                <tbody className='text-gray2'>
                    {items.map((item) => (
                      <TableRow 
                        key={item.id}
                        item={item}
                      />
                    ))}                                            
                </tbody>
            </table>                
        </div>       
    </div>
  );
};

export default ItemSelected;