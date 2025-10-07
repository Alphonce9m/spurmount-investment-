import React from 'react';

const MinimalTest = () => {
  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Minimal Test Page</h1>
        <p>If you can see this, React is working!</p>
      </div>
    </div>
  );
};

export default MinimalTest;
