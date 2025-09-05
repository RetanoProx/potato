import React, { useState, useEffect, useRef } from "react";
import CalendarButton from "./CalendarButton";
import { useNavigate } from "react-router-dom";
import "../styles/timer.css";

// Хук для авто-увеличения высоты textarea
function useAutoResizeTextarea(value) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto"; // сброс
      ref.current.style.height = ref.current.scrollHeight + "px"; // новая высота
    }
  }, [value]);

  return ref;
}

// Отдельный компонент для заметки
function NoteItem({ note, index, onChange, formatTime }) {
  const textareaRef = useAutoResizeTextarea(note.text);

  return (
    <div className="note">
      <p> ⭐ {formatTime(note.time)}</p>
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Add a note"
        value={note.text}
        onChange={(e) => onChange(index, e.target.value)}
      />
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

  const handleGoToCalendar = () => {
    navigate("/CalendarPage"); // меняем маршрут на CalendarPage
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (isAutoScrollEnabled.current && bottomContainerRef.current) {
      bottomContainerRef.current.scrollTop =
        bottomContainerRef.current.scrollHeight;
    }
  }, [notes]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setNotes([]);
  };

  const handleAddNote = () => {
    setNotes((prevNotes) => [...prevNotes, { time, text: "" }]);
    isAutoScrollEnabled.current = true;
  };

  const handleNoteChange = (index, text) => {
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      updatedNotes[index].text = text;
      return updatedNotes;
    });
  };

  const handleScroll = () => {
    if (bottomContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        bottomContainerRef.current;
      isAutoScrollEnabled.current = scrollTop + clientHeight >= scrollHeight;
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
        <button className="calendar-button" onClick={handleGoToCalendar}>
          <CalendarButton />
        </button>
        <h1>{formatTime(time)}</h1>
        <div className="button-container">
          <button className="timer-button" onClick={handleStart} disabled={isRunning}>
            Start
          </button>
          <button className="timer-button" onClick={handleStop} disabled={!isRunning}>
            Stop
          </button>
          <button className="timer-button" onClick={handleReset}>Reset</button>
          <button className="timer-button" onClick={handleAddNote} disabled={!isRunning}>
            Add
          </button>
        </div>
      </div>
      {notes.length > 0 && (
        <div
          className="bottom-container"
          ref={bottomContainerRef}
          onScroll={handleScroll}
        >
          {notes.map((note, index) => (
            <NoteItem
              key={index}
              note={note}
              index={index}
              onChange={handleNoteChange}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TimerApp;
