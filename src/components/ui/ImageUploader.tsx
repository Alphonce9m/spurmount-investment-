import { useState, useCallback, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ImagePlus, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateImageFile, compressImage, formatImageUrl } from '@/lib/utils/image';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  onError?: (error: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  minDimensions?: { width: number; height: number };
  aspectRatio?: number;
}

export function ImageUploader({
  value,
  onChange,
  onError,
  label = 'Upload Image',
  className,
  disabled = false,
  maxSizeMB = 2,
  minDimensions,
  aspectRatio = 16 / 9,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((message: string) => {
    setError(message);
    onError?.(message);
    setIsUploading(false);
    setProgress(0);
  }, [onError]);

  const processFile = useCallback(
    async (file: File) => {
      try {
        setError(null);
        setIsUploading(true);
        setProgress(10);

        // Validate the file
        const validationError = await validateImageFile(file, {
          maxSizeMB,
          minDimensions,
        });

        if (validationError) {
          handleError(validationError);
          return null;
        }

        setProgress(30);

        // Compress the image
        const compressedFile = await compressImage(file, {
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 1200,
          format: 'webp',
        });

        setProgress(60);

        // In a real app, you would upload the file to your server here
        // For now, we'll just create an object URL
        const objectUrl = URL.createObjectURL(compressedFile);
        setProgress(100);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return objectUrl;
      } catch (err) {
        console.error('Error processing image:', err);
        handleError('Failed to process image. Please try again.');
        return null;
      }
    },
    [handleError, maxSizeMB, minDimensions]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      const file = acceptedFiles[0];
      const objectUrl = await processFile(file);
      
      if (objectUrl) {
        onChange(objectUrl);
      }
    },
    [onChange, processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = await processFile(file);
    if (objectUrl) {
      onChange(objectUrl);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-4 transition-colors',
          'flex flex-col items-center justify-center text-center',
          'hover:border-primary/50 cursor-pointer',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <input {...getInputProps()} className="hidden" />
        
        {isUploading ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : value ? (
          <div className="relative w-full group">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            <div className="rounded-full bg-primary/10 p-3">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">
                {isDragActive ? 'Drop the image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                {`PNG, JPG, WEBP (max ${maxSizeMB}MB${minDimensions ? `, min ${minDimensions.width}×${minDimensions.height}px` : ''})`}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}
      
      <div className="relative">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={disabled || isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose a file
        </Button>
      </div>
    </div>
  );
}
