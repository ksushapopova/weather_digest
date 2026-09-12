import { config } from '../config.js';
import { getJson } from './httpClient.js';
import { CityNotFoundError } from '../errors/AppError.js';

export async function geocodeCity(city) {
  const url = new URL(config.geoBaseUrl);
  url.searchParams.set('name', city);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', config.language);
  url.searchParams.set('format', 'json');

  const data = await getJson(url);

  if (!data || !Array.isArray(data.results) || data.results.length === 0) {
    throw new CityNotFoundError(city);
  }

  const [first] = data.results;
  return {
    name: first.name,
    country: first.country ?? '',
    latitude: first.latitude,
    longitude: first.longitude,
  };
}