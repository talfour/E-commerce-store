import React, { useState, useEffect } from "react";

const Notification = ({ type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <>
      {isVisible && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 ${type==="success" ? "bg-green-500" : "bg-red-500"} text-black px-4 py-2 rounded-md animate-slide-up`}
        >
          {message}
          <button className="ml-2 text-black font-bold" onClick={handleDismiss}>
            Ukryj
          </button>
        </div>
      )}
    </>
  );
};

export default Notification;
