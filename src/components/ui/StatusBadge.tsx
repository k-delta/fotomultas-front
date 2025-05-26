import React from 'react';

interface StatusBadgeProps {
  status: string;
  color?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, color = 'default' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;