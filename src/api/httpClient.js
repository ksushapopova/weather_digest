import { config } from '../config.js';
import {
  NetworkError,
  TimeoutError,
  HttpError,
  ParseError,
} from '../errors/AppError.js';

export async function getJson(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? config.timeoutMs;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new TimeoutError(`Превышен таймаут ${timeoutMs} мс: ${url}`);
    }
    throw new NetworkError(`Не удалось выполнить запрос ${url}: ${err.message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new HttpError(response.status, url.toString());
  }

  try {
    return await response.json();
  } catch {
    throw new ParseError(`Ответ не является корректным JSON: ${url}`);
  }
}