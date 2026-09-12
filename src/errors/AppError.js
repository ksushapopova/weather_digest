export class AppError extends Error {
  constructor(message, exitCode = 1, options = {}) {
    super(message, options);
    this.name = 'AppError';
    this.exitCode = exitCode;
  }
}

export class ArgumentError extends AppError {
  constructor(message) {
    super(message, 1);
    this.name = 'ArgumentError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Нет соединения с сетью. Проверьте интернет.') {
    super(message, 1);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Превышено время ожидания ответа от API.') {
    super(message, 1);
    this.name = 'TimeoutError';
  }
}

export class HttpError extends AppError {
  constructor(status, url) {
    const kind =
      status >= 500
        ? 'Сервер API временно недоступен'
        : 'Некорректный запрос к API';
    super(`${kind} (HTTP ${status}): ${url}`, 1);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class CityNotFoundError extends AppError {
  constructor(city) {
    super(`Город не найден: "${city}". Проверьте название.`, 1);
    this.name = 'CityNotFoundError';
    this.city = city;
  }
}

export class ParseError extends AppError {
  constructor(message = 'Некорректный JSON в ответе API.') {
    super(message, 1);
    this.name = 'ParseError';
  }
}