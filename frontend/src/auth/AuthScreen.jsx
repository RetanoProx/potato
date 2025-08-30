import React, { useState, useEffect } from "react";
import "../styles/auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" или "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // проверка авторизации при загрузке
  useEffect(() => {
    fetch(`${API_URL}/api/me`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    const endpoint = mode === "login" ? "login" : "register";

    try {
      const res = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // важно для работы с куками
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");

      if (mode === "register") {
        // после регистрации сразу логиним
        setMode("login");
        alert("✅ Registration successful! Log in.");
      } else {
        setUser({ email });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  if (user) {
    return (
      <div className="auth-container">
        <h2>Welcome, {user.email}!</h2>
        <button className="btn" onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Enter" : "Registration"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button className="btn" type="submit">
          {mode === "login" ? "Enter" : "Sign up"}
        </button>
      </form>
      <p>
        {mode === "login" ? (
          <>Don’t have an account? <span className="link" onClick={() => setMode("register")}>Registration</span></>
        ) : (
          <>Already have an account? <span className="link" onClick={() => setMode("login")}>Enter</span></>
        )}
      </p>
    </div>
  );
}
