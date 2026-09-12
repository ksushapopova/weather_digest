import { config } from '../config.js';
import { getJson } from './httpClient.js';
import { ParseError } from '../errors/AppError.js';

export async function fetchForecast({ latitude, longitude }, days) {
  const url = new URL(config.forecastBaseUrl);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set(
    'daily',
    'temperature_2m_max,temperature_2m_min,precipitation_sum'
  );
  url.searchParams.set('forecast_days', String(days));
  url.searchParams.set('timezone', 'auto');
  if (config.units === 'imperial') {
    url.searchParams.set('temperature_unit', 'fahrenheit');
    url.searchParams.set('precipitation_unit', 'inch');
  }

  const data = await getJson(url);

  const daily = data?.daily;
  if (
    !daily ||
    !Array.isArray(daily.time) ||
    !Array.isArray(daily.temperature_2m_min) ||
    !Array.isArray(daily.temperature_2m_max) ||
    !Array.isArray(daily.precipitation_sum)
  ) {
    throw new ParseError('Ответ прогноза не содержит ожидаемых полей.');
  }

  return daily.time.map((date, i) => ({
    date,
    tMin: daily.temperature_2m_min[i],
    tMax: daily.temperature_2m_max[i],
    precipitation: daily.precipitation_sum[i],
  }));
}