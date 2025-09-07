// DaySessions.jsx
import React, { useState } from "react";
import "../styles/daySessions.css"; // новый файл CSS для стиля DaySessions

const DaySessions = ({ date, sessions, onClose }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSession = (i) => {
    setOpenIndex(openIndex === i ? null : i);
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
            <div key={i} className="day-session-card">
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
