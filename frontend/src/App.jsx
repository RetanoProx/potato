import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthScreen from "./components/AuthScreen";
import TimerApp from "./components/TimerApp";
import CalendarPage from "./components/CalendarPage";
import "./styles/spinner.css"; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not authorized");
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

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
