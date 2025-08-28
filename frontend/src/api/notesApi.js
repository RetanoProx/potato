export async function fetchNotes(year) {
  const response = await fetch(`http://localhost:5000/api/notes?year=${year}`);
  if (!response.ok) throw new Error("Ошибка загрузки заметок");
  return await response.json();
}
