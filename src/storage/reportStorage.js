import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { config } from '../config.js';
import { slugify } from './slugify.js';

export function buildReportFilename(city, date) {
  return `${slugify(city)}-${date}.json`;
}

export function reportPath(city, date) {
  return resolve(config.reportsDir, buildReportFilename(city, date));
}

export async function saveReport(city, date, data) {
  await mkdir(config.reportsDir, { recursive: true });
  const path = reportPath(city, date);
  const json = JSON.stringify(data, null, 2);
  await writeFile(path, json, 'utf8');
  return path;
}

export async function loadReport(city, date) {
  const path = reportPath(city, date);
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    if (err instanceof SyntaxError) return null;
    throw err;
  }
}