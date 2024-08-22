"use client";
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
    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
      {!imageError ? (
        <img
          src={url}
          alt={`${name} logo`}
          className={`object-cover`}
          onError={handleImageError}
        />
      ) : (
        <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
          {getInitial(name)}
        </span>
      )}
    </div>
  );
};

export default Logo;