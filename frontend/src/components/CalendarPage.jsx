import React, { useEffect, useState } from "react";
import YearSelector from "./YearSelector";
import MonthGrid from "./MonthGrid";
import MonthView from "./MonthView";
import DaySessions from "./DaySessions";
import "../styles/calendar.css";

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [sessions, setSessions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDaySessions, setSelectedDaySessions] = useState(null);

  // Подгрузка всех сессий с сервера
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sessions", {
          credentials: "include",
        });
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="calendar-container">
      <YearSelector year={year} setYear={setYear} />
      {selectedDaySessions ? (
        <DaySessions
          date={selectedDaySessions.date}
          sessions={selectedDaySessions.sessions}
          onClose={() => setSelectedDaySessions(null)}
        />
      ) : selectedMonth === null ? (
        <MonthGrid
          year={year}
          sessions={sessions}
          onSelectMonth={(m) => setSelectedMonth(m)}
        />
      ) : (
        <MonthView
          year={year}
          month={selectedMonth}
          sessions={sessions}
          onClose={() => setSelectedMonth(null)}
          onPrev={() =>
            setSelectedMonth((m) => (m > 0 ? m - 1 : m))
          }
          onNext={() =>
            setSelectedMonth((m) => (m < 11 ? m + 1 : m))
          }
          onSelectDay={(date, daySessions) =>
            setSelectedDaySessions({ date, sessions: daySessions })
          }
        />
      )}
    </div>
  );
};

export default CalendarPage;
