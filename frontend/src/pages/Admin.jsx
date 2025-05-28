import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../context/UserProvider';
import axios from 'axios';

// Import Admin components
import AdminHeader from '../components/admin/AdminHeader.jsx';
import AdminStats from '../components/admin/AdminStats.jsx';
import AdminTabs from '../components/admin/AdminTabs.jsx';
import ProductForm from '../components/admin/ProductForm.jsx';
import ProductList from '../components/admin/ProductList.jsx';
import UserList from '../components/admin/UserList.jsx';
import OrderList from '../components/admin/OrderList.jsx';
import SuccessMessage from '../components/admin/SuccessMessage.jsx';

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useUser(); // Destructure user from context
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Check user authentication and role
    const checkAdminAccess = () => {
      // First, check context user
      if (user && user.role === 'Admin') {
        return true;
      }

      // Fallback to session storage
      const userInfo = sessionStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo.role === 'Admin') {
          return true;
        }
      }

      // If no admin access, redirect and return false
      navigate('/login');
      return false;
    };

    // Only proceed with data fetching if user is an admin
    if (checkAdminAccess()) {
      const token = sessionStorage.getItem('userToken');

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.withCredentials = true;
      }

      fetchStats();
      fetchUsers();
      fetchOrders();
      fetchProducts();
    }
  }, [navigate, user]); // Add user to dependency array

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await axios.get('/api/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Full Users Response:', response);
      console.log('Response Data:', response.data);

      let usersData = [];
      if (response.data.users && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      }
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem('userToken');
      const response = await axios.get('/api/admin/getAllOrders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let orderData = [];
      if (response.data.orders && Array.isArray(response.data.orders)) {
        orderData = response.data.orders;
      }
      setOrders(orderData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('userToken');
      const response = await axios.get('/api/admin/getAllProducts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const productsData = response.data.products || response.data;
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      const response = await axios.post('/api/admin/createProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage('Product added successfully!');
        setShowSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchStats();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.response?.data?.message || 'Error adding product');
    }
  };

  const handleUpdateProduct = async (formData) => {
    try {
      const response = await axios.put(
        `/api/admin/updateProduct/${selectedProduct._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.status === 200) {
        setSuccessMessage('Product updated successfully!');
        setShowSuccess(true);

        const updatedProduct = response.data.product || response.data;
        setProducts(prevProducts =>
          prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });

        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.response?.data?.message || 'Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(`/api/admin/deleteProduct/${productId}`);

        if (response.status === 200) {
          setSuccessMessage('Product deleted successfully!');
          setShowSuccess(true);
          fetchProducts();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsUpdateForm(true);
    setSelectedProduct(product);
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      const response = await axios.put(`/api/admin/updateProduct/${productId}`, {
        stock: newStock
      });
      if (response.status === 200) {
        setSuccessMessage('Stock updated successfully!');
        setShowSuccess(true);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const handleUserStatusChange = async (userId, currentStatus) => {
    try {
      if (!userId) {
        setError('Invalid user selected');
        return;
      }

      const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';

      const token = sessionStorage.getItem('userToken');
      await axios.put(
        `/api/admin/updateUserStatus/${userId}`,
        {
          status: newStatus, // Explicitly send status
          userId: userId     // Optional: send userId in body for additional validation
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, status: newStatus }
            : user
        )
      );

      setSuccessMessage(`User status updated to ${newStatus}`);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error updating user status:', error.response?.data || error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update user status';

      setError(errorMessage);
      setShowSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SuccessMessage
        message={successMessage}
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <AdminHeader />

      <AdminStats stats={stats} />

      <ProductForm
        showForm={showForm}
        setShowForm={setShowForm}
        isUpdateForm={isUpdateForm}
        selectedProduct={selectedProduct}
        handleAddProduct={handleAddProduct}
        handleUpdateProduct={handleUpdateProduct}
      />

      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto py-6 px-4">

        {activeTab === 'products' && (
          <ProductList
            products={products}
            loading={loading}
            error={error}
            baseURL={baseURL}
            handleEdit={handleEdit}
            handleAddProduct={handleAddProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleUpdateStock={handleUpdateStock}
            setProducts={setProducts}
            setShowForm={setShowForm}
            setIsUpdateForm={setIsUpdateForm}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {activeTab === 'users' && (
          <UserList
            users={users}
            loading={loading}
            error={error}
            handleUserStatusChange={handleUserStatusChange}
          />
        )}

        {activeTab === 'orders' && (
          <OrderList
            orders={orders}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
