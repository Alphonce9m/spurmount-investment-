import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
        <p className="text-lg text-gray-700">
          If you can see this, the React application is working!
        </p>
        <div className="mt-6">
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
