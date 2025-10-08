import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const BUCKET_NAME = 'product-images';

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param path - The path within the bucket (e.g., 'products' or 'categories')
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  path: string = ''
): Promise<string> => {
  try {
    // Ensure the bucket exists
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(BUCKET_NAME);
    
    if (bucketError && bucketError.message.includes('not found')) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 1024 * 1024 * 5, // 5MB limit
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
    } else if (bucketError) {
      console.error('Error checking bucket:', bucketError);
      throw bucketError;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}`.replace(/\/\//g, '/') : fileName;

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Uploads an image file with additional validation
 * @deprecated Use uploadFile instead
 */
export const uploadImage = async (file: File, path: string): Promise<string> => {
  console.warn('uploadImage is deprecated, use uploadFile instead');
  return uploadFile(file, path);
};

/**
 * Deletes a file from Supabase Storage
 * @param filePath - The full path of the file to delete (e.g., 'products/image.jpg')
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Deletes an image file
 * @deprecated Use deleteFile instead
 */
export const deleteImage = async (filePath: string): Promise<void> => {
  console.warn('deleteImage is deprecated, use deleteFile instead');
  return deleteFile(filePath);
};

/**
 * Gets the public URL for a file in storage
 * @param path - The path to the file in the bucket
 * @returns The public URL
 */
export function getPublicUrl(path: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  
  return publicUrl;
}
    }
    
    // Upload the file
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);
    
    console.log('Upload successful. Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
};

export const deleteImage = async (filePath: string) => {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
