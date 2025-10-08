// Format URL for Supabase storage
export const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return '';
  }

  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    return url;
  }

  const supabaseUrl = 'https://cctpymwbasloxguqntwe.supabase.co';
  
  // Remove any leading slashes from the path
  const cleanPath = url.replace(/^\/+/g, '');
  
  // Handle different path formats
  if (cleanPath.includes('product-images/')) {
    return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
  } else if (cleanPath.startsWith('products/')) {
    return `${supabaseUrl}/storage/v1/object/public/product-images/${cleanPath}`;
  } else {
    return `${supabaseUrl}/storage/v1/object/public/product-images/${cleanPath}`;
  }
};
