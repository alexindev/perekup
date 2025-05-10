import React from 'react';

interface AccessDeniedProps {
  message: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ message }) => {
  return (
    <div className="min-h-screen bg-light p-4 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
        <div className="text-primary text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-medium text-dark mb-4">Доступ запрещен</h1>
        <p className="text-text">{message}</p>
      </div>
    </div>
  );
}; 