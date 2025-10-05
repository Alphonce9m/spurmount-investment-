import { useEffect, useState } from 'react';
import { ref, get, set, push } from 'firebase/database';
import { db } from '@/lib/firebase/config';

export default function TestFirebase() {
  const [message, setMessage] = useState('Testing Firebase connection...');
  const [testData, setTestData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const testRef = ref(db, 'test/connection');
        const snapshot = await get(testRef);
        
        if (!snapshot.exists()) {
          // Create test document if it doesn't exist
          await set(testRef, {
            timestamp: Date.now(),
            status: 'active',
            message: 'Test connection successful',
            app: 'Spurmount Trading & Investments'
          });
          
          // Fetch the newly created document
          const newSnapshot = await get(testRef);
          setTestData(newSnapshot.val());
          setMessage('✅ Successfully connected to Firebase and created test data!');
          console.log('Realtime Database test data:', newSnapshot.val());
        } else {
          setTestData(snapshot.val());
          setMessage('✅ Successfully connected to Firebase!');
          console.log('Realtime Database test data:', snapshot.val());
        }
      } catch (error) {
        console.error('Firebase test error:', error);
        setMessage(`❌ Connection error: ${error.message}`);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-md mx-auto mt-8 text-center">
      <h2 className="text-lg font-semibold mb-2">Firebase Connection Test</h2>
      <p className="text-sm text-gray-700">{message}</p>
      {testData && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h3 className="font-medium mb-1">Test Document Data:</h3>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
