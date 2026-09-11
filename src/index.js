import { parseArgs, getUsage } from './cli/parseArgs.js';
import { AppError, ArgumentError } from './errors/AppError.js';

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

  console.log('Распарсенные аргументы:');
  console.log('  cities :', args.cities);
  console.log('  days   :', args.days);
  console.log('  noCache:', args.noCache);
}

main().catch((err) => {
  console.error('Непредвиденная ошибка:', err);
  process.exitCode = 1;
});
