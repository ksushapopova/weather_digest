import { geocodeCity } from '../api/geocoding.js';
import { fetchForecast } from '../api/forecast.js';
import { AppError } from '../errors/AppError.js';

export async function getCityWeather(city, days) {
  const place = await geocodeCity(city);
  const forecast = await fetchForecast(place, days);
  return {
    city: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    days,
    forecast,
  };
}

export async function getWeatherForCities(cities, days) {
  const settled = await Promise.allSettled(
    cities.map((city) => getCityWeather(city, days))
  );

  const results = [];
  const errors = [];

  settled.forEach((item, index) => {
    if (item.status === 'fulfilled') {
      results.push(item.value);
    } else {
      const reason = item.reason;
      const message =
        reason instanceof AppError ? reason.message : 'Неизвестная ошибка';
      errors.push({ city: cities[index], message });
    }
  });

  return { results, errors };
}