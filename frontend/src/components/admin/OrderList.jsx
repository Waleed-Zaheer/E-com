import React from 'react';

const OrderList = ({ orders }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Order ID</th>
                <th className="py-2 px-4 border-b text-left">User</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Total</th>
                <th className="py-2 px-4 border-b text-left">Payment</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <span className="font-mono text-xs">{order._id.substring(0, 10)}...</span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.user?.name || 'Guest User'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {order.created_at ?
                      new Date(order.created_at).toLocaleDateString() :
                      'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b font-medium">
                    ${order.totalPrice || order.order_total || 0}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.payment_type === 'stripe' ?
                        'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {order.payment_type || 'N/A'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' || order.order_status === 'delivered' ?
                        'bg-green-100 text-green-800' :
                        order.status === 'processing' || order.order_status === 'processing' ?
                          'bg-yellow-100 text-yellow-800' :
                          order.status === 'refunded' || order.order_status === 'refunded' ?
                            'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status || order.order_status || 'placed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-white rounded shadow">
          <p>No orders available</p>
        </div>
      )}
    </div>
  );
};

export default OrderList;