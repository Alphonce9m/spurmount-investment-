import { ReactNode, useEffect, useState } from 'react';
import { useFirebase } from '@/lib/firebase/useFirebase';
import { Loader2 } from 'lucide-react';

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const { isInitialized, error } = useFirebase();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Firebase Error</h2>
          <p className="text-red-700 mb-4">{error.message}</p>
          <p className="text-sm text-gray-600">
            Please check your Firebase configuration and internet connection.
          </p>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing Firebase...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
