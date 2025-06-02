import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = async (cartItem) => {
    try {
      const token = sessionStorage.getItem('userToken');
      if (!token) {
        throw new Error('Please login to add items to cart');
      }

      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (!userInfo) {
        throw new Error('User information not found');
      }

      let updatedCart;
      const existingItemIndex = cart.findIndex(item => item.productId === cartItem.productId);
      console.log('Existing Item Index:', existingItemIndex);
      if (existingItemIndex > -1) {
        updatedCart = cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      } else {
        updatedCart = [...cart, cartItem];
      }

      setCart(updatedCart);
      sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      const response = await axios.post('/api/cart/addToCart',
        {
          userId: userInfo.id,
          ...cartItem
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
        return response.data;
      }
    } catch (error) {
      console.error('Add to cart failed', error);
      // Revert local cart state on error
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
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