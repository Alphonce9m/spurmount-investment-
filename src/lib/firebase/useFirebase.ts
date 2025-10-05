import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const testRef = doc(db, 'test', 'connection');
        const testDoc = await getDoc(testRef);
        
        if (!testDoc.exists()) {
          await setDoc(testRef, {
            timestamp: serverTimestamp(),
            status: 'active',
            message: 'Test connection successful',
            app: 'Spurmount Trading & Investments',
            lastUpdated: serverTimestamp()
          });
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Firebase connection error:', err);
        setError(err instanceof Error ? err : new Error('Unknown Firebase error'));
      }
    };

    testConnection();
  }, []);

  return { isInitialized, error };
};
