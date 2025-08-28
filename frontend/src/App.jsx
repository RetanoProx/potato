import React from 'react';
import ReactDOM from 'react-dom/client';
import Calendar from './components/Calendar';

function App() {
  return (
    <div>
      <Calendar />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);