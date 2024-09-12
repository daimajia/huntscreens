/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ImageOff } from 'lucide-react';

export default function MiniImageLoader({
  src,
  alt,
  className,
  errorClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  errorClassName?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    const img = new Image();
    img.src = src;
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className="relative h-full w-full">
      {loading && (
        <div className="border rounded-lg absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 flex items-center justify-center z-10">
          {/* <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-400 rounded-full animate-spin"></div> */}
        </div>
      )}
      {error ? (
        <div className={cn("border rounded-lg inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800", errorClassName)}>
          <ImageOff className="w-16 h-16 text-gray-400 dark:text-gray-600" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className={cn(
            "w-full h-full object-cover border rounded-lg",
            className
          )}
        />
      )}
    </div>
  );
}
