import { ArgumentError } from '../errors/AppError.js';

export function getUsage() {
  return [
    'Погодный дайджест — консольная утилита на Node.js.',
    '',
    'Использование:',
    '  node src/index.js --city "Город" [--days N] [--no-cache]',
    '',
    'Параметры:',
    '  --city <названия>  обязательный. Один или несколько городов через запятую.',
    '  --days <1..7>      необязательный. Количество дней прогноза. По умолчанию 3.',
    '  --no-cache         необязательный. Игнорировать кэш и запросить данные заново.',
    '  -h, --help         показать эту справку и выйти.',
    '',
    'Примеры:',
    '  node src/index.js --city "Нижний Новгород" --days 3',
    '  node src/index.js --city "Москва,Санкт-Петербург" --days 5',
  ].join('\n');
}

const DEFAULT_DAYS = 3;
const MIN_DAYS = 1;
const MAX_DAYS = 7;

export function parseArgs(argv) {
  const result = {
    cities: [],
    days: DEFAULT_DAYS,
    noCache: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      result.help = true;
      return result;
    }

    if (arg === '--city') {
      const value = argv[++i]; 
      if (value === undefined || value === '') {
        throw new ArgumentError('Параметр --city требует значения. Пример: --city "Москва"');
      }
      result.cities = splitCities(value);
      continue;
    }

    if (arg === '--days') {
      const value = argv[++i];
      if (value === undefined) {
        throw new ArgumentError('Параметр --days требует значения (целое число от 1 до 7).');
      }
      result.days = parseDays(value);
      continue;
    }

    if (arg === '--no-cache') {
      result.noCache = true;
      continue;
    }

    throw new ArgumentError(
      `Неизвестный аргумент: "${arg}". Используйте -h, чтобы увидеть справку.`
    );
  }

  if (!result.help && result.cities.length === 0) {
    throw new ArgumentError('Обязательный параметр --city не указан. Пример: --city "Москва"');
  }

  return result;
}

function splitCities(raw) {
  const cities = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (cities.length === 0) {
    throw new ArgumentError('Параметр --city не может быть пустым.');
  }

  return cities;
}

function parseDays(raw) {
  const value = Number(raw);

  if (!Number.isInteger(value)) {
    throw new ArgumentError(`Параметр --days должен быть целым числом. Получено: "${raw}".`);
  }
  if (value < MIN_DAYS || value > MAX_DAYS) {
    throw new ArgumentError(
      `Параметр --days должен быть в диапазоне ${MIN_DAYS}..${MAX_DAYS}. Получено: ${value}.`
    );
  }

  return value;
}