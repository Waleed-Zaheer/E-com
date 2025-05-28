import React from 'react';
import SuccessMessage from './SuccessMessage.jsx';

const AdminHeader = ({ successMessage, showSuccess, setShowSuccess }) => {
  return (
    <div className="bg-white shadow relative">
      <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="absolute right-4 top-6">
          <SuccessMessage
            message={successMessage}
            show={showSuccess}
            onClose={() => setShowSuccess(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
