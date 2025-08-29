import React from 'react';
import ReactDOM from 'react-dom/client';
import CalendarPage from './components/CalendarPage';

function App() {
  return (
    <div>
      <CalendarPage />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);