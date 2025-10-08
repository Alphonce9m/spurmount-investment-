import { createClient } from '@supabase/supabase-js';

// Get environment variables with type safety
const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (import.meta.env.DEV) {
      console.warn(`Environment variable ${key} is not defined. Using empty string as fallback.`);
    }
    return '';
  }
  return String(value);
};

// Get Supabase configuration from environment variables
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Missing required Supabase configuration. Please check your environment variables.';
  console.error(errorMessage);
  if (import.meta.env.DEV) {
    // In development, we want to fail fast and provide clear feedback
    throw new Error(errorMessage);
  }
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Add error logging for Supabase
export const handleSupabaseError = (error: any, context: string = '') => {
  const errorMessage = error?.message || 'An unknown error occurred';
  const errorDetails = error?.error_description || error?.details || JSON.stringify(error, null, 2);
  
  console.error(`[Supabase Error] ${context}:`, {
    message: errorMessage,
    details: errorDetails,
    timestamp: new Date().toISOString(),
  });
  
  return errorMessage;
};
