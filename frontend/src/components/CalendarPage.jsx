import React, { useEffect, useState } from "react";
import YearSelector from "./YearSelector";
import MonthGrid from "./MonthGrid";
import MonthView from "./MonthView";
import "../styles/calendar.css";

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [notes, setNotes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  return (
    <div className="calendar-container">
      <YearSelector year={year} setYear={setYear} />
      {selectedMonth === null ? (
        <MonthGrid
          year={year}
          notes={notes}
          onSelectMonth={(m) => setSelectedMonth(m)}
        />
      ) : (
        <MonthView
          year={year}
          month={selectedMonth}
          notes={notes}
          onClose={() => setSelectedMonth(null)}
          onPrev={() => setSelectedMonth((m) => (m > 0 ? m - 1 : m))}
          onNext={() => setSelectedMonth((m) => (m < 11 ? m + 1 : m))}
        />
      )}
    </div>
  );
};

export default CalendarPage;
