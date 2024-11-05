import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`
        );
        const data = await response.json();
        
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          location: data.name
        });
      } catch (err) {
        setError('Unable to fetch weather data');
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Unable to get location');
        }
      );
    } else {
      setError('Geolocation not supported');
    }
  }, []);

  return { weather, error };
};