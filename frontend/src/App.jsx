// App.jsx
import React, { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import TimerApp from "./components/TimerApp";

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? (
        <TimerApp />
      ) : (
        <AuthScreen onLogin={setUser} />
      )}
    </>
  );
}

export default App;
