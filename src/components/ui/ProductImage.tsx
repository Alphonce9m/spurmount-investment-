import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatImageUrl } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  quality?: number;
  loading?: 'eager' | 'lazy';
  fallback?: string;
  onError?: () => void;
}

export function ProductImage({
  src,
  alt,
  className,
  containerClassName,
  width = 800,
  height = 600,
  quality = 75,
  loading = 'lazy',
  fallback,
  onError,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      setImageSrc(fallback || '');
      setIsLoading(false);
      return;
    }

    // Reset loading state when src changes
    setIsLoading(true);
    setHasError(false);

    // Create a new image to preload
    const img = new Image();
    
    // Format the URL with optimization parameters
    const formattedUrl = formatImageUrl(src, {
      width,
      height,
      quality,
      format: 'webp',
    });

    img.src = formattedUrl;

    img.onload = () => {
      setImageSrc(formattedUrl);
      setIsLoading(false);
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setHasError(true);
      setIsLoading(false);
      onError?.();
      
      // Use fallback if provided
      if (fallback) {
        setImageSrc(fallback);
      }
    };

    return () => {
      // Cleanup
      img.onload = null;
      img.onerror = null;
    };
  }, [src, width, height, quality, fallback, onError]);

  if (isLoading) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        <Skeleton className={cn('w-full h-full', className)} />
      </div>
    );
  }

  if (hasError || !imageSrc) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          'w-full h-full',
          containerClassName
        )}
      >
        <div className="flex flex-col items-center gap-2 p-4 text-center">
          <ImageIcon className="h-8 w-8" />
          <span className="text-sm">Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onError={() => {
          setHasError(true);
          onError?.();
        }}
      />
    </div>
  );
}
