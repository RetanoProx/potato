import React from "react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MonthGrid = ({ year, sessions, onSelectMonth }) => {
  // Розраховує в яких місяцях є сесії
  const monthsWithSessions = new Set(
    sessions
      .filter(s => new Date(s.session_date).getFullYear() === year)
      .map(s => new Date(s.session_date).getMonth())
  );

  return (
    <div className="month-grid">
      {monthNames.map((name, i) => (
        <button
          key={i}
          className={`month-button ${monthsWithSessions.has(i) ? "highlighted" : ""}`}
          onClick={() => onSelectMonth(i)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default MonthGrid;
