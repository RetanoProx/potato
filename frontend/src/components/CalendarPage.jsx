import React, { useEffect, useState } from "react";
import { fetchNotes } from "../api/notesApi";
import MonthView from "./MonthView";
import "../styles/calendar.css";

export default function CalendarPage() {
  const [year] = useState(new Date().getFullYear());
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchNotes(year).then(setNotes).catch(console.error);
  }, [year]);

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">{year}</h1>
      <div className="year-grid">
        {Array.from({ length: 12 }, (_, idx) => (
          <MonthView key={idx} year={year} month={idx} notes={notes} />
        ))}
      </div>
    </div>
  );
}