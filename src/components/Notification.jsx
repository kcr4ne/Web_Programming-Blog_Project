import React, { useEffect, useState } from 'react';
import { useNotification } from '../hooks/useNotification';

const NOTIFICATION_ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const Notification = () => {
  const { notification, hideNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true); // Trigger fade-in animation
      const timer = setTimeout(() => {
        setIsVisible(false); // Trigger fade-out animation
        // Allow time for fade-out before hiding the component
        setTimeout(hideNotification, 300); 
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
    bottom: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontWeight: '500',
    transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
  };

  const typeStyles = {
    success: { backgroundColor: '#2E7D32' }, // Darker Green
    error: { backgroundColor: '#C62828' },   // Darker Red
    info: { backgroundColor: '#1565C0' },    // Darker Blue
  };

  const style = { ...baseStyle, ...typeStyles[type] };

  return (
    <div style={style} onClick={() => setIsVisible(false)}>
      <span>{NOTIFICATION_ICONS[type]}</span>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
