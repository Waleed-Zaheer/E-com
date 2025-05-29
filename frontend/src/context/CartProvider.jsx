import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = async (cartItem) => {
    try {
      // First, check if item already exists in cart
      const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId);

      let updatedCart;
      if (existingItemIndex > -1) {
        // If item exists, update quantity
        updatedCart = cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        // If item doesn't exist, add new item
        updatedCart = [...cart, cartItem];
      }

      // Update local state
      setCart(updatedCart);

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Optional: Sync with backend
      await axios.post('/api/cart/add', cartItem);

      return updatedCart;
    } catch (error) {
      console.error('Add to cart failed', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);