import React from "react";

export default function DayCell({ date, note }) {
  if (!date) return <div className="day-cell empty"></div>;

  return (
    <div className={`day-cell ${note ? "note" : ""}`}>
      {date.getDate()}
    </div>
  );
}
