import React from 'react';
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("animate-spin rounded-full border-t-2 border-b-2 border-gray-900 dark:border-gray-100", sizeClasses[size], className)}>
    </div>
  );
};

export default Spinner;
