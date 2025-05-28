import React, { useEffect, useState } from 'react';

const SuccessMessage = ({ message, show, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex items-center justify-between px-6 py-4 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in-out">
      <span className="mr-4">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose();
        }}
        className="text-xl font-bold focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default SuccessMessage;
