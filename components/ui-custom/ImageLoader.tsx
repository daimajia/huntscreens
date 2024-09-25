/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ImageOff, Maximize, Minimize, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

type ImageLoaderProps = {
  src: string;
  alt: string;
  imgClassName?: string;
  wrapperClassName?: string;
}

export default function ImageLoader({
  src,
  alt,
  wrapperClassName,
  imgClassName,
}: ImageLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandView, setExpandView] = useState(false);

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
    <div className={cn("relative h-[500px] w-full cursor-pointer", wrapperClassName)} onClick={() => setExpandView(!expandView)}>
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
        <div className={cn(
          "h-full w-full overflow-hidden",
          expandView && "overflow-y-auto"
        )}>
          <img
            src={src}
            alt={alt || ""}
            loading="lazy"
            className={cn(
              "w-full border rounded-lg transition-opacity duration-300",
              loading ? "opacity-50" : "opacity-100",
              expandView ? "h-auto" : "h-full",
              imgClassName
            )}
          />
        </div>
      )}
      {!loading && !error && (
        <>
          <Button
            onClick={() => setExpandView(!expandView)}
            className="absolute bottom-4 right-5 rounded-full p-2 shadow-md"
            size="icon"
            variant="outline"
            aria-label={expandView ? "Minimize image" : "Maximize image"}
          >
            {expandView ? (
              <Minimize className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            ) : (
              <Maximize className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
          <Link
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open image in new window"
          >
            <Button 
              size="icon" 
              variant="outline"
              className="absolute bottom-4 right-16 rounded-full p-2 shadow-md"
            >
              <ExternalLink className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}