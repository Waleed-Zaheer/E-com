import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartProvider';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/getProductById/${id}`);

        if (response.data && response.data.product) {
          setProduct(response.data.product);
        } else {
          throw new Error('No product data found');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      };

      await addToCart(cartItem);
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart', err);
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  if (!product) return <div className="text-center py-4">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 lg:py-16 min-h-screen bg-slate-100 flex justify-center max-w-full">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row h-fit md:h-2/3 my-4 sm:my-6 md:my-8 lg:my-10">

        {/* Left Side: Product Image */}
        <div className="md:w-1/2 p-8 flex items-center justify-center bg-blue-300">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${product?.image || ''}`}
            alt={product?.name || 'Product'}
            className="max-w-full h-2/3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-contain bg-white"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
            }}
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between bg-white">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
              {product?.name || 'Product Name'}
            </h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-green-600">
                ${product?.price?.toFixed(2) || 'N/A'}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {product?.description || 'No description available'}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-700">
                  <strong>Category:</strong> {product?.category || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Stock:</strong>
                  <span className={product?.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {` ${product?.stock || 0} available`}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center mb-6">
              <label className="mr-4 text-gray-700 font-semibold">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product?.stock || 1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(parseInt(e.target.value) || 1, product?.stock || 1)
                  )
                }
                className="w-24 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!(product?.stock > 0)}
              className={`
                w-full py-4 rounded-lg transition-all duration-300 text-base font-bold shadow-md hover:shadow-lg
                ${product?.stock > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-1'
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }
              `}
            >
              {product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
