import { loadReport, saveReport, reportPath } from './reportStorage.js';
export function today() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function getCachedReport(city, date) {
  return loadReport(city, date);
}

export async function putReportToCache(city, date, data) {
  return saveReport(city, date, data);
}

export { reportPath };