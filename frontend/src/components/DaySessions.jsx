import React, { useState } from "react";
import "../styles/daySessions.css"; 
import { apiFetch } from "../api.js";

const DaySessions = ({ date, sessions, onClose, onDelete }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSession = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleDeleteSession = async (sessionId, index) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      const res = await apiFetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        // відразу видаляє сесію зі стану батька
        if (onDelete) onDelete(sessionId);
        if (openIndex === index) setOpenIndex(null); // закриває картку
      } else {
        alert(data.error || "Error deleting session");
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Error deleting session");
    }
  };

  return (
    <div className="day-sessions-view">
      <div className="month-header">
        <span>Sessions for {date.toDateString()}</span>
      </div>

      <div className="day-sessions-container">
        {sessions.map((s, i) => {
          const time = new Date(`${date.toDateString()} ${s.session_time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={s.id} className="day-session-card">
              <button
                className={`session-btn ${openIndex === i ? "active" : ""}`}
                onClick={() => toggleSession(i)}
              >
                {time}
              </button>
              <div className={`session-content ${openIndex === i ? "open" : ""}`}>
                {s.notes_text.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}

                {openIndex === i && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteSession(s.id, i)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="close-btn" onClick={onClose}>
        Back
      </button>
    </div>
  );
};

export default DaySessions;
