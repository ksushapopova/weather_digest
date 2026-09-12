import { parseArgs, getUsage } from './cli/parseArgs.js';
import { AppError, ArgumentError } from './errors/AppError.js';
import { getCityWeather } from './services/weatherService.js';
import {
  today,
  getCachedReport,
  putReportToCache,
} from './storage/cache.js';
import { printCityReport, printErrors } from './format/consoleFormatter.js';

async function processCity(city, days, noCache) {
  const date = today();

  try {
    if (!noCache) {
      const cached = await getCachedReport(city, date);
      if (cached) {
        return { ok: true, data: { ...cached, fromCache: true } };
      }
    }

    const data = await getCityWeather(city, days);
    await putReportToCache(city, date, data);
    return { ok: true, data: { ...data, fromCache: false } };
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'Неизвестная ошибка';
    return { ok: false, error: { city, message } };
  }
}

async function main() {
  const argv = process.argv.slice(2);

  let args;
  try {
    args = parseArgs(argv);
  } catch (err) {
    if (err instanceof ArgumentError) {
      console.error(`Ошибка: ${err.message}`);
      console.error('');
      console.error(getUsage());
      process.exitCode = err.exitCode;
      return;
    }
    if (err instanceof AppError) {
      console.error(`Ошибка: ${err.message}`);
      process.exitCode = err.exitCode;
      return;
    }
    throw err;
  }
  if (args.help) {
    console.log(getUsage());
    return;
  }

  const settled = await Promise.all(
    args.cities.map((city) => processCity(city, args.days, args.noCache))
  );

  const results = settled.filter((r) => r.ok).map((r) => r.data);
  const errors = settled.filter((r) => !r.ok).map((r) => r.error);

  for (const item of results) {
    printCityReport(item);
  }
  printErrors(errors);

  process.exitCode = results.length === 0 ? 1 : 0;
}

main().catch((err) => {
  if (err instanceof AppError) {
    console.error(`Ошибка: ${err.message}`);
    process.exitCode = err.exitCode;
    return;
  }
  console.error(`Непредвиденная ошибка: ${err?.message ?? err}`);
  process.exitCode = 1;
});