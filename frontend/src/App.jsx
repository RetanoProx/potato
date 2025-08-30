import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthScreen from './auth/AuthScreen';

function App() {
  return (
    <div>
      <AuthScreen />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);