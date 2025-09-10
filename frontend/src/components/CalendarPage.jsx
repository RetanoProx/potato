import React, { useEffect, useState } from "react";
import YearSelector from "./YearSelector";
import MonthGrid from "./MonthGrid";
import MonthView from "./MonthView";
import DaySessions from "./DaySessions";
import "../styles/calendar.css";
import { apiFetch } from "../api";

const CalendarPage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [sessions, setSessions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDaySessions, setSelectedDaySessions] = useState(null);
  const [view, setView] = useState("grid"); // "grid" | "month" | "day"

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/sessions");
        if (res.status === 401) {
          console.warn("Not authorized");
          setSessions([]);
          return;
        }
        const m = await res.json();
        setSessions(m.sessions || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    })();
  }, []);

  // Функція для видалення сесії відразу на фронтенді
  const handleDeleteSession = (sessionId) => {
    // Видаляємо з глобального списку
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));

    // Якщо день відкритий, видаляє сесію з нього теж
    if (selectedDaySessions) {
      const filteredDaySessions = selectedDaySessions.sessions.filter(
        (s) => s.id !== sessionId
      );
      setSelectedDaySessions((prev) =>
        prev ? { ...prev, sessions: filteredDaySessions } : prev
      );
    }
  };

  // Карта компонентів за видом
  const views = {
    grid: (
      <MonthGrid
        year={year}
        sessions={sessions}
        onSelectMonth={(m) => {
          setSelectedMonth(m);
          setView("month");
        }}
      />
    ),
    month: (
      <MonthView
        year={year}
        month={selectedMonth}
        sessions={sessions}
        onClose={() => setView("grid")}
        onPrev={() => setSelectedMonth((m) => (m > 0 ? m - 1 : m))}
        onNext={() => setSelectedMonth((m) => (m < 11 ? m + 1 : m))}
        onSelectDay={(date, daySessions) => {
          setSelectedDaySessions({ date, sessions: daySessions });
          setView("day");
        }}
      />
    ),
    day: selectedDaySessions && (
      <DaySessions
        date={selectedDaySessions.date}
        sessions={selectedDaySessions.sessions}
        onClose={() => setView("month")}
        onDelete={handleDeleteSession} // передає функцію видалення
      />
    ),
  };

  return (
    <div className="calendar-container">
      {(view === "grid" || view === "month") && (
        <YearSelector year={year} setYear={setYear} />
      )}

      {views[view]}
    </div>
  );
};

export default CalendarPage;
