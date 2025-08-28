export default function DayCell({ date, note }) {
  if (!date) {
    return <div className="p-2 border rounded bg-gray-50"></div>; // пустая ячейка
  }

  return (
    <div
      className={`p-2 border rounded text-center cursor-pointer transition ${
        note ? "bg-yellow-200 hover:bg-yellow-300" : "hover:bg-gray-100"
      }`}
    >
      <div className="font-medium">{date.getDate()}</div>
      {note && <div className="text-xs text-gray-700 truncate">{note}</div>}
    </div>
  );
}
