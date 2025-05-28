import React from 'react';

const AdminTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['products', 'users', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminTabs;
