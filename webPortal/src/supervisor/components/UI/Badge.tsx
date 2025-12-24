import React from 'react';
import { Severity, Priority, IncidentStatus, TaskStatus } from '../../types';

interface BadgeProps {
  variant: Severity | Priority | IncidentStatus | TaskStatus | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  // Severity
  High: 'bg-danger-100 text-danger-800 border-danger-200',
  Medium: 'bg-warning-100 text-warning-800 border-warning-200',
  Low: 'bg-success-100 text-success-800 border-success-200',
  
  // Status
  Open: 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Resolved: 'bg-success-100 text-success-800 border-success-200',
  Completed: 'bg-success-100 text-success-800 border-success-200',
  Delayed: 'bg-danger-100 text-danger-800 border-danger-200',
  
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const styles = variantStyles[variant] || variantStyles.default;
  
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium
        border ${styles} ${className}
      `}
    >
      {children}
    </span>
  );
};

