import TableRow from './TableRow'

const ItemSelected = () => {
  return (
    <div className='w-[100%] min-h-[450px]'>
        <div className='w-full h-full overflow-x-auto flex items-center justify-center'>
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
                    <TableRow productTitle="Impact Wrench" color="red" price={99} quantity={1} rating={4} />
                    <TableRow productTitle="Impact Wrench" color="red" price={99} quantity={2} rating={5} />                                            
                </tbody>
            </table>                
        </div>       
    </div>
  )
}

export default ItemSelected