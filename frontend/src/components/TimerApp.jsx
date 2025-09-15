import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/timer.css";

// Хук для автоматичного збільшення висоти textarea
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

// Компонент нотатки
function NoteItem({ note, index, onChange, onSave, onEdit, onDelete, formatTime }) {
  const textareaRef = useAutoResizeTextarea(note.text);

  return (
    <div className="note">
      <p>⭐ {formatTime(note.time)}</p>

      {note.isEditing ? (
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Enter a note"
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
          <button className="note-btn save" onClick={() => onSave(index)} title="Save">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="green" viewBox="0 0 24 24">
              <path d="M20.285 6.709a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 16.586l10.293-10.293a1 1 0 011.414 0z" />
            </svg>
          </button>
        ) : (
          <button className="note-btn edit" onClick={() => onEdit(index)} title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="blue" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
        )}
        <button className="note-btn delete" onClick={() => onDelete(index)} title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="red" viewBox="0 0 24 24">
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
  const topContainerRef = useRef(null);          // <-- вимірювання висоти верхньої частини
  const scrollAnchorRef = useRef(null);         // <-- якір для scrollIntoView
  const isAutoScrollEnabled = useRef(true);
  const navigate = useNavigate();

  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);

  // висота інлайн на bottom-container (px)
  const [bottomHeightPx, setBottomHeightPx] = useState(null);

  const isDev5173 =
    typeof window !== "undefined" &&
    window.location.hostname === "localhost" &&
    window.location.port === "5173";

  const API_BASE =
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE) ||
    (isDev5173 ? "http://localhost:5000" : "");

  const handleGoToCalendar = () => navigate("/CalendarPage");

  // Завантаження таймера і нотаток з localStorage
  useEffect(() => {
    const savedStart = localStorage.getItem("timerStart");
    const savedAccum = localStorage.getItem("timerAccum");
    const savedRunning = localStorage.getItem("timerRunning");
    const savedNotes = localStorage.getItem("timerNotes");

    if (savedAccum) accumulatedRef.current = parseInt(savedAccum, 10);
    if (savedStart) startTimeRef.current = parseInt(savedStart, 10);
    if (savedRunning === "true") setIsRunning(true);
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    setTime(() => {
      if (savedRunning === "true" && savedStart) {
        return accumulatedRef.current + Math.floor((Date.now() - parseInt(savedStart, 10)) / 1000);
      }
      return accumulatedRef.current;
    });
  }, []);

  // Збереження таймера і нотаток в localStorage
  useEffect(() => {
    if (isRunning) {
      localStorage.setItem("timerStart", startTimeRef.current);
      localStorage.setItem("timerRunning", "true");
    } else {
      localStorage.setItem("timerRunning", "false");
      localStorage.removeItem("timerStart");
    }
    localStorage.setItem("timerAccum", accumulatedRef.current);
    localStorage.setItem("timerNotes", JSON.stringify(notes));
  }, [isRunning, notes]);

  const getElapsedSeconds = useCallback(() => {
    if (startTimeRef.current !== null) {
      const diffMs = Date.now() - startTimeRef.current;
      return accumulatedRef.current + Math.floor(diffMs / 1000);
    }
    return accumulatedRef.current;
  }, []);

  useEffect(() => {
    let timerId = null;

    if (isRunning) {
      setTime(getElapsedSeconds());
      timerId = setInterval(() => setTime(getElapsedSeconds()), 500);
    } else {
      setTime(getElapsedSeconds());
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, getElapsedSeconds]);

  const handleStart = () => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const handleStop = () => {
    if (!isRunning) return;
    accumulatedRef.current = getElapsedSeconds();
    startTimeRef.current = null;
    setIsRunning(false);
    setTime(accumulatedRef.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    startTimeRef.current = null;
    accumulatedRef.current = 0;
    setTime(0);
    setNotes([]);
    localStorage.removeItem("timerNotes");
  };

  // Функція перерахунку доступної висоти для bottom-container
  const recalcBottomHeight = useCallback(() => {
    if (typeof window === "undefined") return;

    // Використовує visualViewport, якщо є (краще для мобільних + клавіатури)
    const viewportH = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    const topRect = topContainerRef.current?.getBoundingClientRect();
    const topBottom = topRect ? topRect.bottom : 0;

    // невеликий відступ внизу, щоб не прилягало впритул
    const bottomPadding = 8;

    const available = Math.max(0, Math.floor(viewportH - topBottom - bottomPadding));
    setBottomHeightPx(available);
  }, []);

  // Перерахунок висоти при mount / resize / visualViewport resize
  useLayoutEffect(() => {
    recalcBottomHeight();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", recalcBottomHeight);
      if (window.visualViewport && window.visualViewport.addEventListener) {
        window.visualViewport.addEventListener("resize", recalcBottomHeight);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", recalcBottomHeight);
        if (window.visualViewport && window.visualViewport.removeEventListener) {
          window.visualViewport.removeEventListener("resize", recalcBottomHeight);
        }
      }
    };
  }, [recalcBottomHeight]);

  // Автоскрол при додаванні нових нотаток
  useEffect(() => {
    // перерахуємо висоту — наприклад при додаванні примітки layout змінився
    recalcBottomHeight();

    // дає DOM час для відображення, потім прокручує до якоря
    // requestAnimationFrame краще за setTimeout для плавного відображення
    requestAnimationFrame(() => {
      if (isAutoScrollEnabled.current) {
        if (scrollAnchorRef.current) {
          // плавний скрол до останнього елемента
          try {
            scrollAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          } catch (err) {
            // у старих браузерах fallback
            if (bottomContainerRef.current) {
              bottomContainerRef.current.scrollTop = bottomContainerRef.current.scrollHeight;
            }
          }
        } else if (bottomContainerRef.current) {
          bottomContainerRef.current.scrollTop = bottomContainerRef.current.scrollHeight;
        }
      }
    });
  }, [notes, recalcBottomHeight]);

  const handleAddNote = () => {
    const noteTime = getElapsedSeconds();
    setNotes((prev) => [...prev, { time: noteTime, text: "", isEditing: true }]);
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
    if (notes.length === 0) {
      alert("No notes to save");
      return;
    }

    const notesText = notes
      .filter((n) => n.text && n.text.trim() !== "")
      .map((note) => `${formatTime(note.time)} - ${note.text.trim()}`)
      .join("\n");

    if (!notesText) {
      alert("Nothing to save (all notes are empty)");
      return;
    }

    const url = API_BASE ? `${API_BASE}/api/sessions/save` : "/api/sessions/save";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notes_text: notesText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Session saved!");
      } else {
        console.error("Save session response:", data);
        alert("Error while saving: " + (data.error || res.statusText));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving to server");
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const CalendarButton = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9H21M7 3V5M17 3V5M6 12H10V16H6V12ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" />
    </svg>
  );

  return (
    <div className="app-container">
      <div className="top-container" ref={topContainerRef}>
        <button className="save-button" onClick={handleSaveSession} title="Save session">
          <svg fill="#000000" viewBox="-6 -6 42.00 42.00" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="1.5">
            <path d="M6.494 13.994c-.45 0-.67.547-.348.86l8 8c.188.186.488.195.686.02l9-8c.547-.44-.164-1.24-.664-.747l-8.648 7.685-7.666-7.666c-.095-.097-.224-.152-.36-.152zM14.5 2c.277 0 .5.223.5.5v18c0 .277-.223.5-.5.5s-.5-.223-.5-.5v-18c0-.277.223-.5.5-.5zM.5 22c-.276.004-.504.224-.5.5v4c0 .822.678 1.5 1.5 1.5h27c.822 0 1.5-.678 1.5-1.5v-4c.01-.66-1-.657-1 0v4c0 .286-.214.5-.5.5h-27c-.286 0-.5-.214-.5-.5v-4c.004-.282-.218-.504-.5-.5z"></path>
          </svg>
        </button>

        <h1>{formatTime(time)}</h1>

        <button className="calendar-button" onClick={handleGoToCalendar}>
          <CalendarButton />
        </button>

        <div className="button-container">
          <button className="timer-button start-button" onClick={handleStart} disabled={isRunning}>
            Start
          </button>
          <button className="timer-button stop-button" onClick={handleStop} disabled={!isRunning}>
            Stop
          </button>
          <button className="timer-button" onClick={handleReset}>
            Reset
          </button>
          <button className="timer-button" onClick={handleAddNote} disabled={!isRunning}>
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
              const { scrollTop, scrollHeight, clientHeight } = bottomContainerRef.current;
              isAutoScrollEnabled.current = scrollTop + clientHeight >= scrollHeight - 2;
            }
          }}
          // виставляє обчислену висоту інлайн — це вирішує проблему «контейнер росте"
          style={bottomHeightPx ? { height: `${bottomHeightPx}px`, minHeight: 0, overflowY: "auto" } : { minHeight: 0, overflowY: "auto" }}
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

          {/* Якір для надійного автоскролу */}
          <div ref={scrollAnchorRef} />
        </div>
      )}
    </div>
  );
};

export default TimerApp;
