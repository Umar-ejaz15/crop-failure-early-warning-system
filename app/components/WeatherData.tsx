'use client';

import { useEffect, useState } from 'react';

interface WeatherDataPoint {
  date: string;
  tavg: number;
  tmin: number;
  tmax: number;
  prcp: number;
  wspd: number;
  pres: number;
}

interface WeatherResponse {
  data: WeatherDataPoint[];
  meta: {
    generated: string;
  };
}

export default function WeatherData() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <p className="text-center text-zinc-600 dark:text-zinc-400">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!weatherData || !weatherData.data) {
    return (
      <div className="w-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
        <p className="text-center text-zinc-600 dark:text-zinc-400">No weather data available</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
        Weather Data - January 2020
      </h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Station: 10637 | Generated: {new Date(weatherData.meta?.generated).toLocaleString()}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Avg Temp (°C)</th>
              <th className="px-4 py-3">Min Temp (°C)</th>
              <th className="px-4 py-3">Max Temp (°C)</th>
              <th className="px-4 py-3">Precipitation (mm)</th>
              <th className="px-4 py-3">Wind Speed (km/h)</th>
              <th className="px-4 py-3">Pressure (hPa)</th>
            </tr>
          </thead>
          <tbody>
            {weatherData.data.map((day, index) => (
              <tr
                key={index}
                className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <td className="px-4 py-3">{day.date}</td>
                <td className="px-4 py-3">{day.tavg ?? 'N/A'}</td>
                <td className="px-4 py-3">{day.tmin ?? 'N/A'}</td>
                <td className="px-4 py-3">{day.tmax ?? 'N/A'}</td>
                <td className="px-4 py-3">{day.prcp ?? 'N/A'}</td>
                <td className="px-4 py-3">{day.wspd ?? 'N/A'}</td>
                <td className="px-4 py-3">{day.pres ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
