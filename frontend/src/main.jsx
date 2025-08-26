import React from 'react';
import ReactDOM from 'react-dom/client';
import './TimerApp.css';
import TimerApp from './TimerApp';

function App() {
  return (
    <div>
      <TimerApp />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
