function fmt(value) {
  return Number(value).toFixed(1);
}

export function printCityReport(data) {
  const { city, country, latitude, longitude, forecast, fromCache } = data;

  const source = fromCache ? ' [кэш]' : '';
  console.log('');
  console.log(` ${city}, ${country} (${latitude}, ${longitude})${source}`);
  console.log('┌────────────┬──────────┬──────────┬────────────┐');
  console.log('│ Дата       │ Мин °C   │ Макс °C  │ Осадки, мм │');
  console.log('├────────────┼──────────┼──────────┼────────────┤');

  for (const day of forecast) {
    const date = day.date.padEnd(10);
    const tMin = fmt(day.tMin).padStart(8);
    const tMax = fmt(day.tMax).padStart(8);
    const prec = fmt(day.precipitation).padStart(10);
    console.log(`│ ${date} │ ${tMin} │ ${tMax} │ ${prec} │`);
  }

  console.log('└────────────┴──────────┴──────────┴────────────┘');
}

export function printErrors(errors) {
  if (errors.length === 0) return;
  console.error('');
  console.error('Не удалось получить данные:');
  for (const { city, message } of errors) {
    console.error(`  • ${city}: ${message}`);
  }
}