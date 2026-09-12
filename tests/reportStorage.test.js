import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { rm, mkdir } from 'node:fs/promises';

import {
  saveReport,
  loadReport,
  buildReportFilename,
} from '../src/storage/reportStorage.js';

const TEST_DATE = '2099-01-01';

before(async () => {
  await mkdir('reports', { recursive: true });
});

after(async () => {
  await rm(`reports/${buildReportFilename('Тестоград', TEST_DATE)}`, {
    force: true,
  });
});

test('buildReportFilename возвращает slug + дату', () => {
  assert.equal(buildReportFilename('Москва', TEST_DATE), `moskva-${TEST_DATE}.json`);
});

test('saveReport сохраняет, loadReport читает', async () => {
  const data = { city: 'Тестоград', forecast: [] };
  await saveReport('Тестоград', TEST_DATE, data);
  const loaded = await loadReport('Тестоград', TEST_DATE);
  assert.deepEqual(loaded, data);
});

test('loadReport возвращает null, если файла нет', async () => {
  const result = await loadReport('ТакогоГородаНет', '2099-12-31');
  assert.equal(result, null);
});