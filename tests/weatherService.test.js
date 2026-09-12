import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getWeatherForCities } from '../src/services/weatherService.js';

test('getWeatherForCities не падает, если один город недоступен', async () => {
  const { results, errors } = await getWeatherForCities(
    ['Москва', 'Абракадабра-12345'],
    1
  );

  assert.ok(results.length >= 0);
  assert.ok(errors.length >= 1);
  assert.ok(errors.some((e) => e.city === 'Абракадабра-12345'));
});