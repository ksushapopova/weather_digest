import { parseArgs, getUsage } from './cli/parseArgs.js';
import { AppError, ArgumentError } from './errors/AppError.js';
import { getWeatherForCities } from './services/weatherService.js';

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
   if (args.help) {

    console.log(getUsage());
    return;
  }

  console.log('Распарсенные аргументы:');
  console.log('  cities :', args.cities);
  console.log('  days   :', args.days);
  console.log('  noCache:', args.noCache);
}

main().catch((err) => {
  console.error('Непредвиденная ошибка:', err);
  process.exitCode = 1;
});
  let results;
  let errors;
  try {
    ({ results, errors } = await getWeatherForCities(args.cities, args.days));
  } catch (err) {
    if (err instanceof AppError) {
      console.error(`Ошибка: ${err.message}`);
      process.exitCode = err.exitCode;
      return;
    }
    throw err;
  }

  if (results.length > 0) {
    console.log('Успешные города:');
    for (const city of results) {
      console.log(JSON.stringify(city, null, 2));
    }
  }

  if (errors.length > 0) {
    console.error('');
    console.error('Не удалось получить данные:');
    for (const { city, message } of errors) {
      console.error(`  • ${city}: ${message}`);
    }
  }

  if (results.length === 0) {
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }
}

main().catch((err) => {
  if (err instanceof AppError) {
    console.error(`Ошибка: ${err.message}`);
    process.exitCode = err.exitCode;
    return;
  }
  console.error('Непредвиденная ошибка:', err);
  process.exitCode = 1;
});
