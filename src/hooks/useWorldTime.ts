import { useState, useEffect } from 'react';

interface TimeZone {
  name: string;
  timezone: string;
  time: string;
}

export const useWorldTime = () => {
  const [times, setTimes] = useState<TimeZone[]>([
    { name: 'New York', timezone: 'America/New_York', time: '' },
    { name: 'London', timezone: 'Europe/London', time: '' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', time: '' },
  ]);

  useEffect(() => {
    const updateTimes = () => {
      setTimes(prev => prev.map(tz => ({
        ...tz,
        time: new Date().toLocaleTimeString('en-US', {
          timeZone: tz.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      })));
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return times;
}