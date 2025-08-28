import { useEffect, useState } from "react";
import { fetchNotes } from "../api/notesApi";
import MonthView from "./MonthView";

const MONTH_NAMES = [
  "Январь","Февраль","Март","Апрель","Май","Июнь",
  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
];

export default function CalendarPage() {
  const [year] = useState(new Date().getFullYear());
  const [notes, setNotes] = useState({});
  const [openMonth, setOpenMonth] = useState(null);

  useEffect(() => {
    fetchNotes(year).then(setNotes).catch(console.error);
  }, [year]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Календарь {year}
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {MONTH_NAMES.map((m, idx) => (
          <div key={m} className="border rounded p-4 shadow bg-white">
            <button
              onClick={() => setOpenMonth(openMonth === idx ? null : idx)}
              className="w-full text-lg font-semibold hover:text-blue-600 transition"
            >
              {m}
            </button>

            {openMonth === idx && (
              <MonthView year={year} month={idx} notes={notes} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
