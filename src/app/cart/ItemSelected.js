import Link from "next/link";
import TableRow from "./TableRow";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

const ItemSelected = ({ cartItems }) => {
  const { removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // No need to fetch product details, use cartItems directly
  useEffect(() => {
    setProducts(cartItems || []);
  }, [cartItems]);

  // Calculate subtotal
  const subtotal = products.reduce((sum, product) => {
    const qty = product.qty || 1;
    const price = parseFloat(product.priceSnapshot) || 0;
    return sum + price * qty;
  }, 0);

  return (
    <div className="w-[100%] min-h-[450px] flex flex-col lg:flex-row">
      <div className="w-full h-full lg:w-[65%] overflow-x-auto">
        <table className="w-[800px]  ">
          <thead>
            <tr>
              <td className=" border border-gray1 text-center font-semibold"></td>
              <td className="py-2 px-3 border border-gray1 text-center font-semibold">Product</td>
              <td className="py-2 px-3 border border-gray1 text-center font-semibold">Price</td>
              <td className="py-2 px-3 border border-gray1 text-center font-semibold">Quantity</td>
              <td className="py-2 px-3 border border-gray1 text-center font-semibold">Total</td>
              <td className="py-2 px-3 border border-gray1 text-center font-semibold"></td>
            </tr>
          </thead>
          <tbody className="text-gray2">
            {loading ? (
              <tr><td colSpan={6} className="text-center">Loading...</td></tr>
            ) : (
              products.map((product, idx) => (
                <TableRow
                  key={product.productId || product.sku || product.id || idx}
                  product={product}
                  quantity={product.qty || 1}
                  onRemove={() => removeFromCart(product.productId || product.sku || product.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full h-full lg:w-[35%] pl-10">
        <div className="md:w-[70%]">
          <h3 className="font-semibold mt-3">Order Summary</h3>
          <p className="text-gray2 text-sm mt-2">Add a note to your order</p>
          <input
            type="text"
            className="mt-4 outline-none border border-gray1 py-4 px-4 text-sm text-gray1 w-full"
          />
          <div className="flex w-full items-center justify-between mt-5">
            <p className="font-semibold">Subtotal</p>
            <p className="text-gray2 text-sm">${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex w-full items-center justify-between mt-5 gap-10">
            <p className="font-semibold">Shipping</p>
            <p className="text-gray2 text-sm text-end">
              Taxes and shipping calculated at checkout
            </p>
          </div>

          <div className="bg-red w-full flex mt-5">
            <Link
              href={"/checkout"}
              className="bg-black text-white w-full text-center py-2 px-5 hover:bg-first"
            >
              CHECK OUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSelected;
