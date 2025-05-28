import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Base URL for your backend server
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/products/getAllProducts");

        const productData = res.data.products || res.data;
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    // Check if product has stock
    if (product.stock <= 0) {
      alert("Sorry, this item is out of stock");
      return;
    }

    // Check if product is already in cart
    const existingItem = cart.find(item => item._id === product._id);

    let updatedCart;
    if (existingItem) {
      // Increase quantity if already in cart
      updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p._id === product._id
          ? { ...p, stock: p.stock - 1 }
          : p
      )
    );

    // You would typically also update the stock in the backend here
    // axios.put(`/api/products/updateStock/${product._id}`, { stock: product.stock - 1 });
  };

  if (loading) return <div className="text-center py-4">Loading products...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (products.length === 0) return <div className="text-center py-4">No products available</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 w-full">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full max-w-xs p-4 bg-white rounded-2xl shadow hover:shadow-lg border relative"
        >
          <div className="relative">
            <img
              src={`${baseURL}${product.image}`}
              alt={product.name}
              className="h-40 w-full object-contain rounded-lg mb-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
              }}
            />
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`absolute top-2 right-2 p-2 rounded-full 
                ${product.stock <= 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-800 hover:text-white'} 
                shadow transition-colors duration-200`}
              title={product.stock <= 0 ? "Out of stock" : "Add to cart"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-green-600 font-bold text-md">${product.price}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <p className="text-sm">
              Stock:{" "}
              <span
                className={product.stock > 0 ? "text-green-500" : "text-red-500"}
              >
                {product.stock > 0 ? product.stock : "Out of Stock"}
              </span>
            </p>
          </div>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
