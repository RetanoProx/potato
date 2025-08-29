import React from "react";

const daysOfWeek = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const MonthView = ({ year, month, notes, onClose, onPrev, onNext }) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    const hasNote = notes.some(
      (n) => new Date(n.date).toDateString() === date.toDateString()
    );
    days.push({ day: d, hasNote });
  }

  return (
    <div className="month-view">
      <div className="month-header">
        <button onClick={onPrev}>←</button>
        <span>
          {firstDay.toLocaleString("en", { month: "long", year: "numeric" })}
        </span>
        <button onClick={onNext}>→</button>
      </div>

      <div className="days-of-week">
        {daysOfWeek.map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}
      </div>

      <div className="days-grid">
        {Array.from({ length: (firstDay.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="day-cell empty"></div>
        ))}
        {days.map((d) => (
          <div
            key={d.day}
            className={`day-cell ${d.hasNote ? "with-note" : ""}`}
          >
            {d.day}
          </div>
        ))}
      </div>

      <button className="close-btn" onClick={onClose}>
        Back
      </button>
    </div>
  );
};

export default MonthView;
