import { env } from '../../config/env.js';

export async function getWeather(latitude: number, longitude: number) {
  if (env.weatherProvider !== 'open-meteo' || !env.weatherApiUrl) {
    return {
      temperature: 26,
      rain: 0.1,
      visibility: 12,
      wind: 8,
      condition: 'clear'
    };
  }

  const url = `${env.weatherApiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m,visibility&hourly=temperature_2m`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather fetch failed');
    }
    const data = await response.json();
    const current = data.current || {};
    return {
      temperature: Number(current.temperature_2m ?? 26),
      rain: Number(current.precipitation ?? 0),
      visibility: Number(current.visibility ?? 10),
      wind: Number(current.wind_speed_10m ?? 8),
      condition: current.precipitation > 0 ? 'rainy' : 'clear'
    };
  } catch {
    return {
      temperature: 26,
      rain: 0.1,
      visibility: 12,
      wind: 8,
      condition: 'clear'
    };
  }
}
