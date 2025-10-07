import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'product-images';

export const uploadImage = async (file: File, path: string): Promise<string> => {
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
