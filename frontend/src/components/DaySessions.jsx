import React from "react";

const DaySessions = ({ date, sessions, onClose }) => {
  return (
    <div className="month-view">
      <div className="month-header">
        <span>Sessions for {date.toDateString()}</span>
      </div>

      <div className="days-grid">
        {sessions.map((s, i) => (
          <div key={i} className="day-cell with-note" style={{ whiteSpace: "pre-wrap" }}>
            {s.notes_text}
          </div>
        ))}
      </div>

      <button className="close-btn" onClick={onClose}>Back</button>
    </div>
  );
};

export default DaySessions;
