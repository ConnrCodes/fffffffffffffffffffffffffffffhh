import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Timer Complete!');
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (inputTime && !isRunning && time === 0) {
      const seconds = parseInt(inputTime) * 60;
      setTime(seconds);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputTime('');
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center gap-2 mb-3">
        <TimerIcon className="w-5 h-5 text-purple-400" />
        <h2 className="text-purple-400 font-semibold">Timer</h2>
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-mono text-purple-300 mb-2">
          {formatTime(time)}
        </div>
        
        {!isRunning && time === 0 && (
          <input
            type="number"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            placeholder="Minutes"
            className="w-full p-2 bg-purple-900/20 rounded border border-purple-500/30 text-purple-100 mb-2"
          />
        )}

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={time === 0 && !inputTime}
            className="p-2 rounded bg-purple-500 text-white disabled:opacity-50"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 rounded bg-purple-900/30 text-purple-300 hover:bg-purple-900/50"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;