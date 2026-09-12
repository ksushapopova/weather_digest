import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { getJson } from '../src/api/httpClient.js';
import {
  HttpError,
  ParseError,
  TimeoutError,
  NetworkError,
} from '../src/errors/AppError.js';

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = originalFetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('getJson возвращает распарсенный JSON при 200', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    async json() {
      return { hello: 'world' };
    },
  });

  const data = await getJson(new URL('https://example.com'));
  assert.deepEqual(data, { hello: 'world' });
});

test('getJson бросает HttpError на 404', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
    async json() { return {}; },
  });

  await assert.rejects(
    () => getJson(new URL('https://example.com')),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 404);
      return true;
    }
  );
});

test('getJson бросает HttpError на 500', async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
    async json() { return {}; },
  });

  await assert.rejects(
    () => getJson(new URL('https://example.com')),
    (err) => {
      assert.ok(err instanceof HttpError);
      assert.equal(err.status, 500);
      return true;
    }
  );
});

test('getJson бросает ParseError, если ответ не JSON', async () => {
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    async json() { throw new SyntaxError('bad json'); },
  });

  await assert.rejects(
    () => getJson(new URL('https://example.com')),
    ParseError
  );
});

test('getJson бросает TimeoutError при срабатывании AbortController', async () => {
  globalThis.fetch = async (_url, options) => {
    return new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        reject(err);
      });
    });
  };

  await assert.rejects(
    () => getJson(new URL('https://example.com'), { timeoutMs: 20 }),
    TimeoutError
  );
});

test('getJson бросает NetworkError при сетевом сбое', async () => {
  globalThis.fetch = async () => {
    throw new TypeError('fetch failed');
  };

  await assert.rejects(
    () => getJson(new URL('https://example.com')),
    NetworkError
  );
});