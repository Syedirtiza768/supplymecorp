import React from 'react'

const TableRow = ({ product, quantity, onRemove }) => {
    // Show 'Not Available' if price is null/undefined/NaN
    const price = product.priceSnapshot !== undefined && product.priceSnapshot !== null && !isNaN(parseFloat(product.priceSnapshot))
        ? parseFloat(product.priceSnapshot)
        : null;
    // Prefer orgillImages[0] if available, then imageUrl, then default
    const imageSrc = (product.orgillImages && product.orgillImages.length > 0)
        ? product.orgillImages[0]
        : (product.imageUrl || "/images/products/product1.jpg");
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
                <input type="text" value={quantity} readOnly min={1} className='w-[50px] bg-white border border-gray1 text-center p-2 outline-none' />
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