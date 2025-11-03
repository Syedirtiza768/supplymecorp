'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Container1 from '@/components/custom/Container1';
import { CheckCircle } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const id = searchParams.get('orderId');
    const number = searchParams.get('orderNumber');
    
    if (!id) {
      router.push('/');
      return;
    }
    
    setOrderId(id);
    setOrderNumber(number || id);
  }, [searchParams, router]);

  if (!orderId) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="mb-20">
      <Container1>
        <div className="max-w-2xl mx-auto text-center py-10">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your order has been successfully submitted to our system.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span className="font-bold text-lg">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span className="text-gray-600">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <p className="text-sm text-gray-700">
              Your order has been sent to our fulfillment system. You will receive an email confirmation 
              shortly with your order details. Our team will process your order and contact you regarding 
              payment and delivery arrangements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/account/orders"
              className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-md hover:bg-gray-300 transition"
            >
              View Orders
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Questions about your order?</p>
            <p>Contact us at <a href="tel:7182788480" className="text-blue-600 hover:underline">(718) 278-8480</a></p>
          </div>
        </div>
      </Container1>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
