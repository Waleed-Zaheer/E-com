import { useCart } from '../context/CartProvider';
import { useState, useEffect } from 'react';

export default function Cart() {
  const { cart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculatedTotal = cart.reduce((sum, item) =>
      sum + (item.price * item.quantity), 0
    );
    setTotal(calculatedTotal);

  }, [cart]);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 md:py-12 lg:py-16 min-h-screen bg-slate-100">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-800 p-6 border-b">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.productId} className="flex p-6 hover:bg-gray-50">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="ml-6 flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">Price: ${item.price}</p>
                    </div>

                    {/* Quantity and Price */}
                    <div className="mt-4 sm:mt-0 flex items-center space-x-6">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-3">Quantity:</span>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="w-16 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex flex-col items-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold border-t">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg 
                             font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}