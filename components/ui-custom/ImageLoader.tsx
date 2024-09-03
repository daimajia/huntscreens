"use client"
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ImageOff } from 'lucide-react';

export default function ImageLoader({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };
  }, [src]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {loading && (
        <div className="border rounded-lg absolute inset-0 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin"></div>
        </div>
      )}
      {error ? (
        <div className="border rounded-lg absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <ImageOff className="w-16 h-16 text-gray-400 dark:text-gray-600" />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover object-top border rounded-lg transition-opacity duration-300",
            loading ? "opacity-50" : "opacity-100",
            className
          )}
        />
      )}
    </div>
  );
}