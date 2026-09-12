import { test } from 'node:test';
import assert from 'node:assert/strict';

import { slugify } from '../src/storage/slugify.js';

test('slugify транслитерирует кириллицу', () => {
  assert.equal(slugify('Москва'), 'moskva');
  assert.equal(slugify('Нижний Новгород'), 'nizhniy-novgorod');
  assert.equal(slugify('Санкт-Петербург'), 'sankt-peterburg');
});

test('slugify схлопывает лишние дефисы', () => {
  assert.equal(slugify('Москва  ,  СПб'), 'moskva-sPb'.toLowerCase());
  assert.equal(slugify('  Москва  '), 'moskva');
});

test('slugify оставляет латиницу и цифры', () => {
  assert.equal(slugify('New York 2'), 'new-york-2');
});