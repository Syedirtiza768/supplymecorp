"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ShoppingCart, User, MapPin, Phone, Mail, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, loading: cartLoading } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn && !cartLoading) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [isLoggedIn, cartLoading, router]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(item.price_snapshot || item.price || 0) * (item.qty || 1),
    0
  );
  const taxRate = 0.08875; // NY tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleSubmitOrder = async () => {
    if (!isLoggedIn) {
      setError("Please log in to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log("Submitting order with customer:", user.custNo);
      
      const orderPayload = {
        customer: {
          custNo: user.custNo,
          email: user.email,
          firstName: user.firstName || user.name?.split(" ")[0] || "",
          lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
          address: user.address,
          city: user.city,
          state: user.state,
          zip: user.zip,
          phone: user.phone,
        },
        cartItems: cartItems,
        shippingAddress: {
          firstName: user.firstName || user.name?.split(" ")[0] || "",
          lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
          address1: user.address,
          city: user.city,
          state: user.state,
          zip: user.zip,
          phone: user.phone,
        },
        specialInstructions: `Web order for customer ${user.custNo}`,
        deliveryMethod: "ship",
      };

      console.log("Order payload:", orderPayload);

      const response = await fetch("/api/orders/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      console.log("Order response:", result);

      if (response.ok && result.success) {
        setSuccess(true);
        await clearCart();
        
        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
          router.push(
            `/checkout/confirmation?orderId=${result.orderId}&orderNumber=${result.orderNumber}`
          );
        }, 2000);
      } else {
        setError(result.error || result.message || "Failed to submit order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Unable to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading || !isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Order Submitted Successfully!
          </h2>
          <p className="text-gray-600">Redirecting to confirmation page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order and submit to Counterpoint</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Cart Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {user.custNo}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start">
                  <User className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium">{user.name || `${user.firstName} ${user.lastName}`}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">
                      {user.address}
                      <br />
                      {user.city}, {user.state} {user.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Items Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b pb-4 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.name || item.productId}</h3>
                      <p className="text-sm text-gray-500">SKU: {item.productId}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(parseFloat(item.price_snapshot || item.price || 0) * item.qty).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${parseFloat(item.price_snapshot || item.price || 0).toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (Est. 8.875%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">TBD</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={submitting || cartItems.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  submitting || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Ordering...
                  </span>
                ) : (
                  "Order"
                )}
              </button>

              <Link
                href="/cart"
                className="block text-center mt-4 text-sm text-gray-600 hover:text-gray-800"
              >
                ← Return to Cart
              </Link>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> Your order will be submitted to our team. Payment and final processing will be handled by our staff.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
