import DayCell from "./DayCell";

export default function MonthView({ year, month, notes }) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  // Добавляем пустые ячейки перед началом месяца
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  // Добавляем дни месяца
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {["Вс","Пн","Вт","Ср","Чт","Пт","Сб"].map((w) => (
        <div key={w} className="text-center font-semibold">{w}</div>
      ))}
      {days.map((date, idx) => {
        const key = date ? date.toISOString().split("T")[0] : `empty-${idx}`;
        return (
          <DayCell
            key={key}
            date={date}
            note={date ? notes[key] : null}
          />
        );
      })}
    </div>
  );
}
