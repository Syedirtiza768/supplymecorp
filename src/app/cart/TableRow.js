import React from 'react'
import { useCart } from '@/context/CartContext';

const TableRow = ({ product, quantity, onRemove }) => {
    const { updateQuantity } = useCart();
    // Show 'Not Available' if price is null/undefined/NaN
    const price = product.priceSnapshot !== undefined && product.priceSnapshot !== null && !isNaN(parseFloat(product.priceSnapshot))
        ? parseFloat(product.priceSnapshot)
        : null;
    // Prefer orgillImages[0] if available, then imageUrl, then default
    const imageSrc = (product.orgillImages && product.orgillImages.length > 0)
        ? product.orgillImages[0]
        : (product.imageUrl || "/images/products/product1.jpg");

    const handleQtyChange = async (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (!val) val = '1';
        const qty = Math.max(1, parseInt(val, 10));
        await updateQuantity(product.productId || product.sku || product.id, qty);
    };

    return (
        <tr>
            <td className='border border-gray1 text-center w-[120px] '>
                <img src={imageSrc} alt={product.onlineTitleDescription || product.sku || "Product"} className='h-[100px] w-full object-contain' />
            </td>
            <td className='py-2 border border-gray1 text-center '>
                <p className='text-xl font-semibold'>{product.onlineTitleDescription || product.title || product.sku || "Product"}</p>
                {product.brandName && <p className='text-sm italic'>Brand: {product.brandName}</p>}
                {product.color && <p className='text-sm italic'>Color: {product.color}</p>}
            </td>
            <td className='py-2 border border-gray1 text-center '>
                {price !== null ? `$${price.toFixed(2)}` : <span className="text-gray-400">Not Available</span>}
            </td>
            <td className='py-2 border border-gray1 text-center '>
                <input 
                    type="number" 
                    value={quantity} 
                    min={1} 
                    className='w-[50px] bg-white border border-gray1 text-center p-2 outline-none' 
                    onChange={handleQtyChange}
                />
            </td>
            <td className='py-2 border border-gray1 text-center '>
                {price !== null ? `$${(price * quantity).toFixed(2)}` : <span className="text-gray-400">Not Available</span>}
            </td>
            <td className='py-2 border border-gray1 text-center '>
                <button
                    className='bg-black text-white py-1 px-5 rounded-sm hover:opacity-80'
                    onClick={onRemove}
                >REMOVE</button>
            </td>
        </tr>
    );
}

export default TableRow