import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState([]);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - timer;
      const id = setInterval(() => {
        setTimer(Date.now() - startTime);
      }, 100);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setTimer(0);
    setIsRunning(false);
    setNotes([]);
  };

  const addNote = () => {
    const newNote = { time: (timer / 1000).toFixed(2), text: '' };
    setNotes([...notes, newNote]);
  };

  const updateNote = (index, text) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { ...note, text } : note
    );
    setNotes(updatedNotes);
  };

  return (
    <div className="app">
      <h1>Timer App</h1>
      <div className="timer">{(timer / 1000).toFixed(2)}s</div>
      <div className="buttons">
        <button onClick={startTimer} className="start-btn">Start Timer</button>
        <button onClick={stopTimer} className="stop-btn">Stop Timer</button>
        <button onClick={resetTimer} className="reset-btn">Reset Timer</button>
        <button onClick={addNote} className="note-btn">Add Note</button>
      </div>
      <div className="notes">
        {notes.map((note, index) => (
          <div key={index} className="note">
            <p>Time: {note.time}s</p>
            <input
              type="text"
              placeholder="Add a note"
              value={note.text}
              onChange={(e) => updateNote(index, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
