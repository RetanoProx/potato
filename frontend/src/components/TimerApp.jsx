import React, { useState, useEffect, useRef } from "react";
import CalendarButton from "./CalendarButton";
import { useNavigate } from "react-router-dom";
import { appendNoteLines } from "../api/notesApi";
import "../styles/timer.css";

// Хук для авто-увеличения высоты textarea
function useAutoResizeTextarea(value) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return ref;
}

// Компонент заметки
function NoteItem({
  note,
  index,
  onChange,
  onSave,
  onEdit,
  onDelete,
  formatTime,
}) {
  const textareaRef = useAutoResizeTextarea(note.text);

  return (
    <div className="note">
      <p>⭐ {formatTime(note.time)}</p>

      {note.isEditing ? (
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Введите заметку"
          value={note.text}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSave(index);
            }
          }}
        />
      ) : (
        <p className="note-text">{note.text}</p>
      )}

      <div className="note-buttons">
        {note.isEditing ? (
          <button
            className="note-btn save"
            onClick={() => onSave(index)}
            title="Сохранить"
          >
            {/* галочка */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="black"
              viewBox="0 0 24 24"
            >
              <path d="M20.285 6.709a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 16.586l10.293-10.293a1 1 0 011.414 0z" />
            </svg>
          </button>
        ) : (
          <button
            className="note-btn edit"
            onClick={() => onEdit(index)}
            title="Редактировать"
          >
            {/* карандаш */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="black"
              viewBox="0 0 24 24"
            >
              <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        )}
        <button
          className="note-btn delete"
          onClick={() => onDelete(index)}
          title="Удалить"
        >
          {/* крестик */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="black"
            viewBox="0 0 24 24"
          >
            <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.42L10.59 12l-4.89 4.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const TimerApp = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState([]);
  const bottomContainerRef = useRef(null);
  const isAutoScrollEnabled = useRef(true);
  const navigate = useNavigate();

  const handleGoToCalendar = () => navigate("/CalendarPage");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (isAutoScrollEnabled.current && bottomContainerRef.current) {
      bottomContainerRef.current.scrollTop =
        bottomContainerRef.current.scrollHeight;
    }
  }, [notes]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setNotes([]);
  };

  const handleAddNote = () => {
    setNotes((prev) => [...prev, { time, text: "", isEditing: true }]);
    isAutoScrollEnabled.current = true;
  };

  const handleNoteChange = (index, text) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index].text = text;
      return updated;
    });
  };

  const handleSaveNote = (index) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index].isEditing = false;
      return updated;
    });
  };

  const handleEditNote = (index) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index].isEditing = true;
      return updated;
    });
  };

  const handleDeleteNote = (index) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSession = async () => {
    if (!notes.length) return;
    const pad = (n) => String(n).padStart(2, "0");

    const lines = notes.map((n) => {
      const h = pad(Math.floor(n.time / 3600));
      const m = pad(Math.floor((n.time % 3600) / 60));
      const s = pad(n.time % 60);
      return `${h}:${m}:${s} - ${n.text}`;
    });

    const today = new Date().toISOString().slice(0, 10);
    try {
      await appendNoteLines(today, lines);
      alert("Session saved ✅");
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении ❌");
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="app-container">
      <div className="top-container">
        <button
          className="save-button"
          onClick={handleSaveSession}
          title="Сохранить сессию"
        >
          <svg fill="#000000" viewBox="-6 -6 42.00 42.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="1.5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M6.494 13.994c-.45 0-.67.547-.348.86l8 8c.188.186.488.195.686.02l9-8c.547-.44-.164-1.24-.664-.747l-8.648 7.685-7.666-7.666c-.095-.097-.224-.152-.36-.152zM14.5 2c.277 0 .5.223.5.5v18c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-18c0-.277.223-.5.5-.5zM.5 22c-.276.004-.504.224-.5.5v4c0 .822.678 1.5 1.5 1.5h27c.822 0 1.5-.678 1.5-1.5v-4c.01-.66-1-.657-1 0v4c0 .286-.214.5-.5.5h-27c-.286 0-.5-.214-.5-.5v-4c.004-.282-.218-.504-.5-.5z"></path></g></svg>
        </button>

        <h1>{formatTime(time)}</h1>

        <button className="calendar-button" onClick={handleGoToCalendar}>
          <CalendarButton />
        </button>

        <div className="button-container">
          <button
            className="timer-button start-button"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className="timer-button stop-button"
            onClick={handleStop}
            disabled={!isRunning}
          >
            Stop
          </button>
          <button className="timer-button " onClick={handleReset}>
            Reset
          </button>
          <button
            className="timer-button"
            onClick={handleAddNote}
            disabled={!isRunning}
          >
            Add
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <div
          className="bottom-container"
          ref={bottomContainerRef}
          onScroll={() => {
            if (bottomContainerRef.current) {
              const { scrollTop, scrollHeight, clientHeight } =
                bottomContainerRef.current;
              isAutoScrollEnabled.current =
                scrollTop + clientHeight >= scrollHeight;
            }
          }}
        >
          {notes.map((note, index) => (
            <NoteItem
              key={index}
              note={note}
              index={index}
              onChange={handleNoteChange}
              onSave={handleSaveNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimerApp;
