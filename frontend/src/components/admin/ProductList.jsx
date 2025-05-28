import React from 'react';

const ProductList = ({
  products,
  loading,
  error,
  baseURL,
  handleEdit,
  handleDeleteProduct,
  handleUpdateStock,
  setProducts,
  setShowForm,
  setIsUpdateForm,
  setSelectedProduct
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product Management</h2>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowForm(true);
            setIsUpdateForm(false);
            setSelectedProduct(null);
          }}
        >
          Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading products...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-4">
          <p>No products available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg shadow-md overflow-hidden bg-white">
              <div className="relative">
                <img
                  src={`${baseURL}${product.image}`}
                  alt={product.title || product.name}
                  className="h-48 w-full object-contain mix-blend-multiply"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Edit product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Delete product"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{product.title || product.name}</h2>
                  <p className="text-green-600 font-bold">${product.price}</p>
                </div>
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Stock:</span>
                    <input
                      type="number"
                      min="0"
                      value={product.stock || (product.inStock ? 1 : 0)}
                      onChange={(e) => {
                        const newStock = parseInt(e.target.value);
                        if (!isNaN(newStock) && newStock >= 0) {
                          setProducts(prev =>
                            prev.map(p => p._id === product._id ? { ...p, stock: newStock } : p)
                          );
                        }
                      }}
                      className="w-16 p-1 border rounded text-center"
                    />
                    <button
                      onClick={() => handleUpdateStock(product._id, product.stock || (product.inStock ? 1 : 0))}
                      className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs py-1 px-2 rounded"
                    >
                      Update
                    </button>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;