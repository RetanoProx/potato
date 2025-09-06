const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://potato-bnbk.onrender.com";

// Загрузка всех заметок за год
export async function fetchNotes(year) {
  const response = await fetch(`${API_URL}/api/notes?year=${year}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Ошибка загрузки заметок");
  return await response.json();
}

// Получить заметку за конкретную дату (YYYY-MM-DD)
export async function fetchNoteByDate(date) {
  const response = await fetch(`${API_URL}/api/notes/${date}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Ошибка загрузки заметки");
  return await response.json();
}

// Полная перезапись заметки за дату
export async function saveNote(date, note) {
  const response = await fetch(`${API_URL}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ date, note }),
  });
  if (!response.ok) throw new Error("Ошибка сохранения заметки");
  return await response.json();
}

// Добавление строк к заметке за дату
export async function appendNoteLines(date, lines) {
  const response = await fetch(`${API_URL}/api/notes/append`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ date, lines }),
  });
  if (!response.ok) throw new Error("Ошибка добавления строк к заметке");
  return await response.json();
}
