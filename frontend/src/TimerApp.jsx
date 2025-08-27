import React, { useState, useEffect } from 'react';
import './TimerApp.css';

const TimerApp = () => {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let animationFrameId;

    const updateElapsedTime = () => {
      if (isRunning && startTime) {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }
      animationFrameId = requestAnimationFrame(updateElapsedTime);
    };

    if (isRunning) {
      animationFrameId = requestAnimationFrame(updateElapsedTime);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, startTime]);

  useEffect(() => {
    const bottomContainer = document.querySelector('.bottom-container');
    if (bottomContainer) {
      bottomContainer.scrollTop = bottomContainer.scrollHeight;
    }
  }, [notes]);

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsedTime * 1000);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setNotes([]);
  };

  const handleAddNote = () => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { time: elapsedTime, text: '' },
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
        <h1>{formatTime(elapsedTime)}</h1>
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
              <textarea
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
