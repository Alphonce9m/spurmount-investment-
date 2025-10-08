import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/client';

// Base URL for Supabase storage
const STORAGE_URL = 'https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public';
const BUCKET_NAME = 'product-images';

/**
 * Formats a Supabase storage URL to a fully qualified public URL
 * @param url The URL or path from Supabase storage
 * @param options Additional options for URL formatting
 * @returns A fully qualified public URL that can be used in an img src
 */
export const formatImageUrl = (
  url: string | undefined | null,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string => {
  if (!url) return '';
  
  // Remove any query parameters and trim whitespace
  let cleanUrl = url.split('?')[0].trim();
  let path = '';
  
  // If it's a full URL
  if (cleanUrl.startsWith('http')) {
    // If it's already a public URL, extract the path
    const publicMatch = cleanUrl.match(/storage\/v1\/object\/public\/([^?]+)/);
    if (publicMatch) {
      path = publicMatch[1];
    }
    // Handle signed/object URLs
    else if (cleanUrl.includes('/object/') || cleanUrl.includes('/sign/')) {
      const pathMatch = cleanUrl.match(/product-images\/(.+)/);
      if (pathMatch?.[1]) {
        path = `product-images/${pathMatch[1].split('?')[0]}`;
      }
    } else {
      return cleanUrl; // Return as is if we can't parse it
    }
  } else {
    // If it's just a path, clean it up
    path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
    if (!path.startsWith(`${BUCKET_NAME}/`)) {
      path = `${BUCKET_NAME}/${path}`;
    }
  }
  
  // Construct the base URL
  const urlObj = new URL(`${STORAGE_URL}/${path}`);
  
  // Add optimization parameters if provided
  const { width, height, quality = 75, format = 'auto' } = options;
  if (width) urlObj.searchParams.set('width', width.toString());
  if (height) urlObj.searchParams.set('height', height.toString());
  urlObj.searchParams.set('quality', quality.toString());
  if (format !== 'auto') {
    urlObj.searchParams.set('format', format);
  }
  
  return urlObj.toString();
};

/**
 * Validates an image file
 * @param file - The file to validate
 * @param options - Validation options
 * @returns A promise that resolves to an error message if validation fails, or null if valid
 */
export async function validateImageFile(
  file: File, 
  options: { 
    maxSizeMB?: number; 
    allowedTypes?: string[];
    minDimensions?: { width: number; height: number };
  } = {}
): Promise<string | null> {
  const { 
    maxSizeMB = 2, 
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    minDimensions
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
  }

  // Check file size (default 2MB)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File is too large. Maximum size is ${maxSizeMB}MB`;
  }

  // If min dimensions are provided, validate them asynchronously
  if (minDimensions) {
    try {
      const dimensionError = await new Promise<string | null>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < minDimensions.width || img.height < minDimensions.height) {
            resolve(`Image must be at least ${minDimensions.width}x${minDimensions.height}px`);
          } else {
            resolve(null);
          }
        };
        img.onerror = () => resolve('Failed to load image for validation');
        img.src = URL.createObjectURL(file);
      });
      
      if (dimensionError) {
        return dimensionError;
      }
    } catch (error) {
      console.error('Error validating image dimensions:', error);
      return 'Failed to validate image dimensions';
    }
  }

  return null;
}

/**
 * Compresses an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A promise that resolves to the compressed file
 */
export async function compressImage(
  file: File,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<File> {
  const { 
    quality = 0.7, 
    maxWidth = 1200, 
    maxHeight = 1200,
    format = 'webp'
  } = options;

  const mimeType = `image/${format}`;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      // Set canvas dimensions and draw image
      canvas.width = width;
      canvas.height = height;
      
      // Handle orientation if needed (for JPEGs with EXIF data)
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        // Reset canvas to the identity matrix before drawing
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with the correct orientation
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        // For other formats, just draw normally
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Convert to Blob and then to File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          const fileName = file.name.replace(/\.[^/.]+$/, '') || 'image';
          const compressedFile = new File(
            [blob],
            `${fileName}.${format}`,
            { type: mimeType }
          );
          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generates a unique file name for upload
 * @param file - The original file
 * @returns A unique file name with the same extension
 */
export function generateUniqueFileName(file: File): string {
  const extension = file.name.split('.').pop() || '';
  const uniqueId = uuidv4();
  return `${uniqueId}.${extension}`;
}

/**
 * Handles image upload to Supabase storage
 * @param file - The file to upload
 * @param path - The path in the storage bucket
 * @param options - Upload options
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  file: File,
  path: string = '',
  options: {
    compress?: boolean;
    compressOptions?: Parameters<typeof compressImage>[1];
    onProgress?: (progress: number) => void;
  } = {}
): Promise<string> {
  const { compress = true, compressOptions, onProgress } = options;
  
  try {
    // Validate the file first
    const validationError = await validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    // Compress the image if enabled
    const fileToUpload = compress 
      ? await compressImage(file, compressOptions) 
      : file;

    // Generate a unique file name
    const fileName = generateUniqueFileName(fileToUpload);
    const filePath = path ? `${path}/${fileName}`.replace(/\/\//g, '/') : fileName;
    const fullPath = `${BUCKET_NAME}/${filePath}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileToUpload.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Return the public URL
    return formatImageUrl(fullPath);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Base64 placeholder for images
const PLACEHOLDER_SVG = '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#eee"/><path d="M30 30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10 10 4.477 10 10-4.477 10-10 10-10-4.477-10-10v-20" stroke="#ccc" stroke-width="2" fill="none"/><path d="M15 15h70v70H15z" stroke="#ccc" stroke-width="2" fill="none"/></svg>';

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;base64,${btoa(PLACEHOLDER_SVG)}`;

