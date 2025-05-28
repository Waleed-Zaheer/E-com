import React from 'react';

const ProductForm = ({
  showForm,
  setShowForm,
  isUpdateForm,
  selectedProduct,
  handleAddProduct,
  handleUpdateProduct
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
          onClick={() => setShowForm(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isUpdateForm ? 'Update Product' : 'Add New Product'}
        </h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (isUpdateForm) {
              await handleUpdateProduct(formData);
            } else {
              await handleAddProduct(formData);
            }
            setShowForm(false);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="name"
              defaultValue={selectedProduct?.name || ''}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              defaultValue={selectedProduct?.description || ''}
              required
              className="w-full border border-gray-300 p-2 rounded"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              defaultValue={selectedProduct?.price || ''}
              required
              step="0.01"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              defaultValue={selectedProduct?.category || ''}
              required
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select a category</option>
              {[
                "Electronics",
                "Clothing",
                "Home",
                "Sports",
                "Books",
                "Beauty",
                "Toys",
                "Fruits",
                "Vegetables",
                "Others"
              ].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              defaultValue={selectedProduct?.stock || ''}
              required
              min="0"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full"
              required={!isUpdateForm}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            {isUpdateForm ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;