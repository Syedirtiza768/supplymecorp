import Link from 'next/link'
import TableRow from './TableRow'

const ItemSelected = () => {
  return (
    <div className='w-[100%] min-h-[450px] flex flex-col lg:flex-row'>
        <div className='w-full h-full lg:w-[65%] overflow-x-auto'>
            <table className='w-[800px]  '>
                <thead >
                    <tr>
                        <td className=' border border-gray1 text-center font-semibold'></td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Product</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Price</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Quantity</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'>Total</td>
                        <td className='py-2 px-3 border border-gray1 text-center font-semibold'></td>
                    </tr>
                </thead>
                <tbody className='text-gray2'>
                    <TableRow productTitle="Impact Wrench" color="red" price={99} quantity={1} />
                    <TableRow productTitle="Impact Wrench" color="red" price={99} quantity={2} />                        
                    <tr>
                        <td className=' text-center p-2 border border-gray1' colSpan={6}>
                            <button 
                                className='bg-black text-white py-1 px-5 rounded-sm mr-3 hover:opacity-80'
                                onClick={() => {}}
                            >UPDATE</button>
                            <button 
                                className='bg-black text-white py-1 px-5 rounded-sm hover:opacity-80'
                                onClick={() => {}}
                            >CONTINUE SHOPPING</button>
                        </td>
                    </tr>
                </tbody>
            </table>                
        </div>
        <div className='w-full h-full lg:w-[35%] pl-10'>
            <div className='md:w-[70%]'>
                <h3 className='font-semibold mt-3'>Order Summary</h3>
                <p className='text-gray2 text-sm mt-2'>Add a note to your order</p>
                <input type="text" className='mt-4 outline-none border border-gray1 py-4 px-4 text-sm text-gray1 w-full' />
                <div className='flex w-full items-center justify-between mt-5'>
                    <p className='font-semibold'>Subtotal</p>
                    <p className='text-gray2 text-sm'>$99.00</p>
                </div>
                <div className='flex w-full items-center justify-between mt-5 gap-10'>
                    <p className='font-semibold'>Shipping</p>
                    <p className='text-gray2 text-sm text-end'>Taxes and shipping calculated at checkout</p>
                </div>

                <div className='bg-red w-full flex mt-5'>
                    <Link 
                        href={"/checkout"}
                        className='bg-second text-white w-full text-center py-2 px-5 hover:bg-first'                    
                    >CHECK OUT</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ItemSelected