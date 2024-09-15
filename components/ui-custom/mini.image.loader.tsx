/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ImageOff } from 'lucide-react';

export function MiniLogoLoader({
  src,
  alt,
  size = 24,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [error, setError] = useState(false);

  return (
    <div className="rounded-full relative shadow-md w-full h-full">
      {error ? (
        <ImageOff className="w-full h-full p-2 text-gray-400 dark:text-gray-600" />
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn("object-cover", className)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

export default function MiniScreenshotLoader({
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
            "w-full h-full object-cover rounded-t-lg",
            className
          )}
        />
      )}
    </div>
  );
}
