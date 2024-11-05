import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, CloudLightning, Wind, Droplets, Thermometer, Umbrella, Clock, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherData {
  day: string;
  temp: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
  hourlyForecast?: {
    time: string;
    temp: number;
    condition: string;
  }[];
  details?: {
    feelsLike: number;
    uvIndex: number;
    visibility: number;
    pressure: number;
  };
}

const WeatherForecast = () => {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<WeatherData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockForecast: WeatherData[] = [
        {
          day: 'Today',
          temp: 72,
          humidity: 65,
          condition: 'sunny',
          windSpeed: 7,
          precipitation: 0,
          hourlyForecast: [
            { time: '9 AM', temp: 68, condition: 'sunny' },
            { time: '12 PM', temp: 72, condition: 'sunny' },
            { time: '3 PM', temp: 75, condition: 'sunny' },
            { time: '6 PM', temp: 70, condition: 'sunny' }
          ],
          details: {
            feelsLike: 74,
            uvIndex: 6,
            visibility: 10,
            pressure: 1015
          }
        },
        {
          day: 'Tomorrow',
          temp: 66,
          humidity: 75,
          condition: 'rain',
          windSpeed: 9,
          precipitation: 80,
          hourlyForecast: [
            { time: '9 AM', temp: 64, condition: 'cloudy' },
            { time: '12 PM', temp: 66, condition: 'rain' },
            { time: '3 PM', temp: 65, condition: 'rain' },
            { time: '6 PM', temp: 63, condition: 'rain' }
          ],
          details: {
            feelsLike: 64,
            uvIndex: 2,
            visibility: 5,
            pressure: 1012
          }
        },
        {
          day: 'Wednesday',
          temp: 68,
          humidity: 70,
          condition: 'cloudy',
          windSpeed: 6,
          precipitation: 20,
          hourlyForecast: [
            { time: '9 AM', temp: 65, condition: 'cloudy' },
            { time: '12 PM', temp: 68, condition: 'cloudy' },
            { time: '3 PM', temp: 69, condition: 'cloudy' },
            { time: '6 PM', temp: 66, condition: 'cloudy' }
          ],
          details: {
            feelsLike: 67,
            uvIndex: 3,
            visibility: 8,
            pressure: 1014
          }
        },
        {
          day: 'Thursday',
          temp: 64,
          humidity: 80,
          condition: 'storm',
          windSpeed: 15,
          precipitation: 90,
          hourlyForecast: [
            { time: '9 AM', temp: 62, condition: 'storm' },
            { time: '12 PM', temp: 64, condition: 'storm' },
            { time: '3 PM', temp: 63, condition: 'storm' },
            { time: '6 PM', temp: 61, condition: 'storm' }
          ],
          details: {
            feelsLike: 61,
            uvIndex: 1,
            visibility: 3,
            pressure: 1008
          }
        },
        {
          day: 'Friday',
          temp: 70,
          humidity: 60,
          condition: 'sunny',
          windSpeed: 5,
          precipitation: 0,
          hourlyForecast: [
            { time: '9 AM', temp: 66, condition: 'sunny' },
            { time: '12 PM', temp: 70, condition: 'sunny' },
            { time: '3 PM', temp: 72, condition: 'sunny' },
            { time: '6 PM', temp: 68, condition: 'sunny' }
          ],
          details: {
            feelsLike: 72,
            uvIndex: 7,
            visibility: 10,
            pressure: 1016
          }
        }
      ];

      setForecast(mockForecast);
      setSelectedDay(mockForecast[0]);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <CloudRain className="w-10 h-10" />;
      case 'snow': return <CloudSnow className="w-10 h-10" />;
      case 'storm': return <CloudLightning className="w-10 h-10" />;
      case 'sunny': return <Sun className="w-10 h-10" />;
      case 'cloudy': return <Cloud className="w-10 h-10" />;
      default: return <Wind className="w-10 h-10" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-black/80 rounded-lg p-4 backdrop-blur-sm border border-cyan-500/30 h-16 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="text-cyan-400">Loading weather data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/80 rounded-lg p-6 backdrop-blur-sm border border-cyan-500/30">
      <div className="grid grid-cols-5 gap-6">
        {forecast.map((day, index) => (
          <motion.button
            key={day.day}
            className={`p-6 rounded-lg transition-colors ${
              selectedDay?.day === day.day
                ? 'bg-cyan-500/20 border border-cyan-500'
                : 'bg-cyan-900/20 hover:bg-cyan-900/30'
            }`}
            onClick={() => {
              setSelectedDay(day);
              setShowDetails(true);
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="text-center space-y-4">
              <div className="text-cyan-300 text-lg font-medium tracking-wide">
                {day.day}
              </div>
              <div className="text-cyan-400 flex justify-center py-2">
                {getWeatherIcon(day.condition)}
              </div>
              <div className="text-cyan-300 text-3xl font-bold">
                {day.temp}°F
              </div>
              <div className="flex justify-center gap-4 text-sm pt-2">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300">{day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300">{day.windSpeed} mph</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showDetails && selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-cyan-900/20 rounded-lg p-6 border border-cyan-500/30"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-cyan-300 text-xl font-semibold">
                Detailed Forecast for {selectedDay.day}
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-cyan-400 font-medium">Hourly Forecast</h4>
                <div className="space-y-2">
                  {selectedDay.hourlyForecast?.map((hour) => (
                    <div
                      key={hour.time}
                      className="flex items-center justify-between bg-cyan-900/30 rounded p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-300">{hour.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-300">{hour.temp}°F</span>
                        {getWeatherIcon(hour.condition)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-cyan-400 font-medium">Additional Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-cyan-900/30 rounded p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Thermometer className="w-4 h-4" />
                      <span>Feels Like</span>
                    </div>
                    <div className="text-cyan-300 text-lg">
                      {selectedDay.details?.feelsLike}°F
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 rounded p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Sun className="w-4 h-4" />
                      <span>UV Index</span>
                    </div>
                    <div className="text-cyan-300 text-lg">
                      {selectedDay.details?.uvIndex} of 10
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 rounded p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Eye className="w-4 h-4" />
                      <span>Visibility</span>
                    </div>
                    <div className="text-cyan-300 text-lg">
                      {selectedDay.details?.visibility} mi
                    </div>
                  </div>
                  <div className="bg-cyan-900/30 rounded p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                      <Umbrella className="w-4 h-4" />
                      <span>Pressure</span>
                    </div>
                    <div className="text-cyan-300 text-lg">
                      {selectedDay.details?.pressure} hPa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeatherForecast;