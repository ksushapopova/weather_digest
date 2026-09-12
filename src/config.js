import 'dotenv/config';

function env(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

export const config = {
  geoBaseUrl: env('GEO_BASE_URL', 'https://geocoding-api.open-meteo.com/v1/search'),
  forecastBaseUrl: env('FORECAST_BASE_URL', 'https://api.open-meteo.com/v1/forecast'),
  timeoutMs: Number(env('TIMEOUT_MS', '5000')),
  reportsDir: env('REPORTS_DIR', 'reports'),
  units: env('UNITS', 'metric'),
  language: env('LANGUAGE', 'ru'),
};