import React from "react";
import DayCell from "./DayCell";

export default function MonthView({ year, month, notes }) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return (
    <div className="month-block">
      <div className="month-name">
        {firstDay.toLocaleString("ru-RU", { month: "long" })}
      </div>
      <div className="month-days-grid">
        {["Вс","Пн","Вт","Ср","Чт","Пт","Сб"].map((w) => (
          <div key={w} className="weekday-header">{w}</div>
        ))}
        {days.map((date, idx) => {
          const key = date ? date.toISOString().split("T")[0] : `empty-${idx}`;
          return (
            <DayCell key={key} date={date} note={date ? notes[key] : null} />
          );
        })}
      </div>
    </div>
  );
}
