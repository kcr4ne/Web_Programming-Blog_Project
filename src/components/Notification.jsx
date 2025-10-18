import React, { useEffect } from 'react';
import { useNotification } from '../hooks/useNotification';

const Notification = () => {
  const { notification, hideNotification } = useNotification();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000); // Hide after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [notification, hideNotification]);

  if (!notification) {
    return null;
  }

  const { message, type } = notification;

  const baseStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    fontSize: '1rem',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(0)',
  };

  const typeStyles = {
    success: { backgroundColor: '#4CAF50' }, // Green
    error: { backgroundColor: '#F44336' },   // Red
    info: { backgroundColor: '#2196F3' },    // Blue
  };

  const style = { ...baseStyle, ...typeStyles[type] };

  return (
    <div style={style} onClick={hideNotification}>
      {message}
    </div>
  );
};

export default Notification;
