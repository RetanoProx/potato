import React from "react";

const monthNames = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

const MonthGrid = ({ year, notes, onSelectMonth }) => {
  // получаем месяцы, где есть заметки
  const monthsWithNotes = new Set(
    notes.map((n) => new Date(n.date).getMonth())
  );

  const MonthButton = ({ name, highlighted, onClick }) => (
    <button
      className={`month-button ${highlighted ? "highlighted" : ""}`}
      onClick={onClick}
    >
      {name}
    </button>
  );

  return (
    <div className="month-grid">
      {monthNames.map((name, i) => (
        <MonthButton
          key={i}
          name={name}
          highlighted={monthsWithNotes.has(i)}
          onClick={() => onSelectMonth(i)}
        />
      ))}
    </div>
  );
};

export default MonthGrid;
