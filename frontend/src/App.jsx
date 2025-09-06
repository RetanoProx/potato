// App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthScreen from "./components/AuthScreen";
import TimerApp from "./components/TimerApp";
import CalendarPage from "./components/CalendarPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>

      <Route
        path="/"
        element={
          user ? <Navigate to="/timer" /> : <AuthScreen onLogin={setUser} />
        }
      />

      
      <Route
        path="/timer"
        element={user ? <TimerApp /> : <Navigate to="/" />}
      />

      
      <Route
        path="/CalendarPage"
        element={user ? <CalendarPage /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
