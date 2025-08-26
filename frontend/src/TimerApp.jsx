import React, { useState, useEffect } from 'react';
import './TimerApp.css';

const TimerApp = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState([]);

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
    const bottomContainer = document.querySelector('.bottom-container');
    if (bottomContainer) {
      bottomContainer.scrollTop = bottomContainer.scrollHeight;
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
    setNotes((prevNotes) => [
      ...prevNotes,
      { time, text: '' },
    ]);
  };

  const handleNoteChange = (index, text) => {
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      updatedNotes[index].text = text;
      return updatedNotes;
    });
  };

  const formatTime = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="app-container">
      <div className="top-container">
        <h1>{formatTime(time)}</h1>
        <div className="button-container">
          <button onClick={handleStart} disabled={isRunning}>Start</button>
          <button onClick={handleStop} disabled={!isRunning}>Stop</button>
          <button onClick={handleReset}>Reset</button>
          <button onClick={handleAddNote} disabled={!isRunning}>Add</button>
        </div>
      </div>
      {notes.length > 0 && (
        <div className="bottom-container">
          {notes.map((note, index) => (
            <div key={index} className="note">
              <p>🚩 {formatTime(note.time)}</p>
              <input
                type="text"
                placeholder="Add a note"
                value={note.text}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimerApp;
