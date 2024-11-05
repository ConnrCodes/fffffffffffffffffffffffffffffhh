import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, CloudLightning, Wind } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: string;
    location: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY&units=metric`
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          location: data.name
        });
      } catch (err) {
        setError('Could not fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    // For demo purposes, using fixed coordinates (New York)
    getWeather(40.7128, -74.0060);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <CloudRain className="w-8 h-8" />;
      case 'snow': return <CloudSnow className="w-8 h-8" />;
      case 'thunderstorm': return <CloudLightning className="w-8 h-8" />;
      case 'clear': return <Sun className="w-8 h-8" />;
      case 'clouds': return <Cloud className="w-8 h-8" />;
      default: return <Wind className="w-8 h-8" />;
    }
  };

  if (error) {
    return (
      <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-purple-900/50 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-purple-900/50 rounded w-3/4"></div>
            <div className="h-4 bg-purple-900/50 rounded w-1/2"></div>
          </div>
        </div>
      ) : weather && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-400 font-semibold">{weather.location}</span>
            <span className="text-purple-300">{weather.temp}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-400">
              {getWeatherIcon(weather.condition)}
            </span>
            <span className="text-purple-300">{weather.condition}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;