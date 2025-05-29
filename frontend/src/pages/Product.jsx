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
    <div className="container mx-auto px-4 py-8 flex justify-center bg-slate-100 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row h">
        {/* Left Side: Product Image */}
        <div className="md:w-1/2 p-4 flex items-center justify-center bg-white-300">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${product?.image || ''}`}
            alt={product?.name || 'Product'}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Found';
            }}
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product?.name || 'Product Name'}
            </h1>

            <div className="mb-4">
              <span className="text-3xl font-semibold text-green-600">
                ${product?.price?.toFixed(2) || 'N/A'}
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 text-sm">
                {product?.description || 'No description available'}
              </p>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {product?.category || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <strong>Stock:</strong>
                  <span className={product?.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {` ${product?.stock || 0} available`}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <label className="mr-4 text-sm font-semibold">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product?.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(
                  Math.min(
                    parseInt(e.target.value),
                    product?.stock || 1
                  )
                )}
                className="w-20 border rounded px-2 py-1 text-sm"
              />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!(product?.stock > 0)}
              className={`
                w-full py-3 rounded-lg transition duration-300 text-sm font-semibold
                ${product?.stock > 0
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
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