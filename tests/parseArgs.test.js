import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseArgs } from '../src/cli/parseArgs.js';
import { ArgumentError } from '../src/errors/AppError.js';

test('--city с одним городом', () => {
  const args = parseArgs(['--city', 'Москва']);
  assert.deepEqual(args.cities, ['Москва']);
  assert.equal(args.days, 3);       
  assert.equal(args.noCache, false);
  assert.equal(args.help, false);
});

test('--city с несколькими городами через запятую', () => {
  const args = parseArgs(['--city', 'Москва, Санкт-Петербург , Нижний Новгород']);
  assert.deepEqual(args.cities, ['Москва', 'Санкт-Петербург', 'Нижний Новгород']);
});

test('--city игнорирует пустые элементы между запятыми', () => {
  const args = parseArgs(['--city', 'Москва,, , СПб,']);
  assert.deepEqual(args.cities, ['Москва', 'СПб']);
});

test('--days задаёт число дней', () => {
  const args = parseArgs(['--city', 'Москва', '--days', '5']);
  assert.equal(args.days, 5);
});

test('--days без значения — ошибка', () => {
  assert.throws(
    () => parseArgs(['--city', 'Москва', '--days']),
    ArgumentError
  );
});

test('--days не число — ошибка', () => {
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', 'abc']), ArgumentError);
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', '3.5']), ArgumentError);
});

test('--days вне диапазона — ошибка', () => {
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', '0']), ArgumentError);
  assert.throws(() => parseArgs(['--city', 'Москва', '--days', '8']), ArgumentError);
});

test('--no-cache устанавливает флаг', () => {
  const args = parseArgs(['--city', 'Москва', '--no-cache']);
  assert.equal(args.noCache, true);
});

test('без --city — ошибка', () => {
  assert.throws(() => parseArgs([]), ArgumentError);
  assert.throws(() => parseArgs(['--days', '3']), ArgumentError);
});

test('пустой --city — ошибка', () => {
  assert.throws(() => parseArgs(['--city', '']), ArgumentError);
  assert.throws(() => parseArgs(['--city', ' , , ']), ArgumentError);
});

test('неизвестный аргумент — ошибка', () => {
  assert.throws(() => parseArgs(['--city', 'Москва', '--foo']), ArgumentError);
  assert.throws(() => parseArgs(['Москва']), ArgumentError);
});

test('--help возвращает help=true и не падает без --city', () => {
  const args = parseArgs(['--help']);
  assert.equal(args.help, true);
  assert.deepEqual(args.cities, []);
});