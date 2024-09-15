"use client";
import { ImageOff } from 'lucide-react';
import React, { useState } from 'react';

interface LogoProps {
  name: string;
  url: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ name, url, className }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}>
      {!imageError ? (
        <img
          src={url}
          alt={`${name} logo`}
          className={`object-cover`}
          onError={handleImageError}
        />
      ) : (
        <ImageOff size={40} className="text-gray-400 dark:text-gray-600 p-2" />
      )}
    </div>
  );
};

export default Logo;