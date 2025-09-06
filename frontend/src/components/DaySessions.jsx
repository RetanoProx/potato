import React, { useState } from "react";

const DaySessions = ({ date, sessions, onClose }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSession = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="month-view">
      <div className="month-header">
        <span>Sessions for {date.toDateString()}</span>
      </div>

      <div className="day-sessions-container">
        {sessions.map((s, i) => {
          // session_time из БД: "20:57:34.026533" или аналогично
          const [hours, minutes, seconds] = s.session_time.split(":");
          const timeObj = new Date(date);
          timeObj.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));

          const displayTime = timeObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          return (
            <div key={i} className="day-session">
              <button
                className="session-btn"
                onClick={() => toggleSession(i)}
              >
                {displayTime}
              </button>
              {openIndex === i && (
                <div className="session-content">
                  {s.notes_text.split("\n").map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              )}
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
