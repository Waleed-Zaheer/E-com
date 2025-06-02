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

  const updateItemQuantity = async (productId, quantity) => {
    try {
      const token = sessionStorage.getItem('userToken');
      if (!token) {
        throw new Error('Please login to update cart');
      }

      // Update locally first
      const updatedCart = cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );

      const response = await axios.put(`/api/cart/update/${productId}`,
        { quantity: Math.max(1, quantity) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = sessionStorage.getItem('userToken');
      if (!token) {
        throw new Error('Please login to remove items');
      }

      // Remove locally first
      const updatedCart = cart.filter(item => item.productId !== productId);

      const response = await axios.delete(`/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const token = sessionStorage.getItem('userToken');
      if (!token) {
        throw new Error('Please login to clear cart');
      }

      const response = await axios.delete('/api/cart/clearCart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setCart([]);
        sessionStorage.setItem('cart', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      addToCart,
      updateItemQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
};
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);