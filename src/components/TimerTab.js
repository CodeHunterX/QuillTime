import React, { useEffect, useState, useRef } from 'react';
import './TimerTab.css';

const TimerTab = () => {
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startTimer = () => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          const nextSession = sessionType === 'focus' ? 'break' : 'focus';
          setSessionType(nextSession);
          const nextDuration = nextSession === 'focus' ? durationMinutes * 60 : 5 * 60;
          return nextDuration;
        }
        return prev - 1;
      });
    }, 1000);

    setIsRunning(true);
  };

  const pauseTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    pauseTimer();
    setSessionType('focus');
    setTimeLeft(durationMinutes * 60);
  };

  const handleSliderChange = (value) => {
    if (!isRunning) {
      setDurationMinutes(value);
      setTimeLeft(value * 60);
    } else {
      setDurationMinutes(value); // Update for next session
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="timer-tab">
      <h3>{sessionType === 'focus' ? 'Focus Time' : 'Break Time'}</h3>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-controls">
        {isRunning ? (
          <button onClick={pauseTimer}>Pause</button>
        ) : (
          <button onClick={startTimer}>Start</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>

      <div className="slider-container">
        <label htmlFor="duration-slider">
          Session Length: {durationMinutes} min
        </label>
        <input
          type="range"
          id="duration-slider"
          min={1}
          max={60}
          value={durationMinutes}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default TimerTab;
