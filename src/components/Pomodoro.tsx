import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (!isBreak) {
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Time for a break!');
        }
      } else {
        setTimeLeft(25 * 60); // Back to 25 minutes
        setIsBreak(false);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break is over. Time to focus!');
        }
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Pomodoro Timer</h2>
      </div>

      <div className="text-center">
        <div className="text-3xl font-mono text-purple-300 mb-4">
          {formatTime(timeLeft)}
        </div>
        
        <div className="text-sm text-purple-400 mb-4">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={toggleTimer}
            className="p-2 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={resetTimer}
            className="p-2 rounded bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;