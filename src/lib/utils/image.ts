/**
 * Formats a Supabase storage URL to a fully qualified public URL
 * @param url The URL or path from Supabase storage
 * @returns A fully qualified public URL that can be used in an img src
 */
export const formatImageUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  
  // Remove any query parameters and trim whitespace
  let cleanUrl = url.split('?')[0].trim();
  
  // If it's a full URL
  if (cleanUrl.startsWith('http')) {
    // If it's already a public URL, return it
    if (cleanUrl.includes('/storage/v1/object/public/')) {
      return cleanUrl;
    }
    
    // Handle signed/object URLs
    if (cleanUrl.includes('/object/') || cleanUrl.includes('/sign/')) {
      // Extract the path after 'product-images/'
      const pathMatch = cleanUrl.match(/product-images\/(.+)/);
      if (pathMatch && pathMatch[1]) {
        return `https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/product-images/${pathMatch[1].split('?')[0]}`;
      }
    }
    
    return cleanUrl;
  }
  
  // If it's just a path, construct the full public URL
  // Remove leading slash if present
  const path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
  return `https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/product-images/${path}`;
};
