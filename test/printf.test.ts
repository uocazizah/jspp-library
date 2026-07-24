import assert from 'node:assert';
import * as util from 'util';
import { sprintf, printf } from '../src/io/printf';

// ========== Deteksi dan inisialisasi test runner ==========
let usingNodeTest = false;
let describe: (name: string, fn: () => void) => void;
let it: (name: string, fn: () => void) => void;
let beforeEach: (fn: () => void) => void;
let afterEach: (fn: () => void) => void;

try {
  // Coba gunakan node:test (tersedia di Node.js >= 18)
  const testModule = require('node:test');
  describe = testModule.describe;
  it = testModule.it;
  beforeEach = testModule.beforeEach;
  afterEach = testModule.afterEach;
  usingNodeTest = true;
} catch {
  // Fallback: test runner sederhana dengan assert
  type TestCase = {
    name: string;
    fn: () => void;
    before?: () => void;
    after?: () => void;
  };

  const tests: TestCase[] = [];
  let currentBeforeEach: (() => void)[] = [];
  let currentAfterEach: (() => void)[] = [];
  const hookStack: { before: (() => void)[]; after: (() => void)[] }[] = [];

  describe = (name: string, fn: () => void) => {
    hookStack.push({
      before: [...currentBeforeEach],
      after: [...currentAfterEach],
    });
    fn();
    const prev = hookStack.pop()!;
    currentBeforeEach = prev.before;
    currentAfterEach = prev.after;
  };

  // ========== PERBAIKAN DI SINI ==========
  it = (name: string, fn: () => void) => {
    // Salin hooks saat ini, agar tidak terpengaruh perubahan setelah describe selesai
    const beforeHooks = [...currentBeforeEach];
    const afterHooks = [...currentAfterEach];
    tests.push({
      name,
      fn,
      before: beforeHooks.length > 0
        ? () => beforeHooks.forEach((h) => h())
        : undefined,
      after: afterHooks.length > 0
        ? () => afterHooks.forEach((h) => h())
        : undefined,
    });
  };
  // =======================================

  beforeEach = (fn: () => void) => {
    currentBeforeEach.push(fn);
  };

  afterEach = (fn: () => void) => {
    currentAfterEach.push(fn);
  };

  // Fungsi menjalankan semua tes yang telah dikumpulkan
  function runTests() {
    let passed = 0;
    let failed = 0;
    for (const test of tests) {
      try {
        if (test.before) test.before();
        test.fn();
        if (test.after) test.after();
        console.log(`✓ ${test.name}`);
        passed++;
      } catch (err) {
        console.error(`✗ ${test.name}`);
        console.error(err);
        failed++;
        if (test.after) test.after(); // tetap jalankan after meskipun gagal
      }
    }
    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
  }

  // Jalankan fallback setelah semua describe selesai
  setTimeout(() => runTests(), 0);
}
// ==========================================================

// ========== Tes sprintf ==========
describe('sprintf', () => {
  describe('escape %%', () => {
    it('should output single percent', () => {
      assert.strictEqual(sprintf('%%'), '%');
      assert.strictEqual(sprintf('%% %%'), '% %');
    });

    it('should not treat %% as specifier', () => {
      assert.strictEqual(sprintf('%%s'), '%s');
      assert.strictEqual(sprintf('10%%'), '10%');
    });
  });

  describe('specifier %s', () => {
    it('should convert to string', () => {
      assert.strictEqual(sprintf('%s', 'hello'), 'hello');
      assert.strictEqual(sprintf('%s', 123), '123');
      assert.strictEqual(sprintf('%s', null), 'null');
      assert.strictEqual(sprintf('%s', undefined), 'undefined');
      assert.strictEqual(sprintf('%s', {}), '[object Object]');
      assert.strictEqual(sprintf('%s', [1, 2]), '1,2');
    });
  });

  describe('specifiers %d and %i', () => {
    it('should parse integer', () => {
      assert.strictEqual(sprintf('%d', 42), '42');
      assert.strictEqual(sprintf('%i', 42.7), '42');
      assert.strictEqual(sprintf('%d', '42'), '42');
      assert.strictEqual(sprintf('%d', '42.7'), '42');
      assert.strictEqual(sprintf('%d', 'abc'), 'NaN');
      assert.strictEqual(sprintf('%d', null), 'NaN');
      assert.strictEqual(sprintf('%d', undefined), 'NaN');
      assert.strictEqual(sprintf('%d', true), 'NaN');
      assert.strictEqual(sprintf('%d', false), 'NaN');
    });
  });

  describe('specifier %f', () => {
    it('should parse float', () => {
      assert.strictEqual(sprintf('%f', 42.7), '42.7');
      assert.strictEqual(sprintf('%f', '42.7'), '42.7');
      assert.strictEqual(sprintf('%f', '42'), '42');
      assert.strictEqual(sprintf('%f', 'abc'), 'NaN');
      assert.strictEqual(sprintf('%f', null), 'NaN');
      assert.strictEqual(sprintf('%f', undefined), 'NaN');
    });
  });

  describe('specifiers %o and %O', () => {
    it('should inspect object with util.inspect', () => {
      const obj = { a: 1, b: 'test' };
      const expected = util.inspect(obj, {
        showHidden: false,
        depth: null,
        colors: false,
      });
      assert.strictEqual(sprintf('%o', obj), expected);
      assert.strictEqual(sprintf('%O', obj), expected);
    });

    it('should inspect array', () => {
      const arr = [1, 2, 3];
      const expected = util.inspect(arr, {
        showHidden: false,
        depth: null,
        colors: false,
      });
      assert.strictEqual(sprintf('%o', arr), expected);
    });
  });

  describe('specifier %j (JSON)', () => {
    it('should stringify JSON', () => {
      assert.strictEqual(sprintf('%j', { a: 1, b: 'test' }), '{"a":1,"b":"test"}');
      assert.strictEqual(sprintf('%j', [1, 2]), '[1,2]');
      assert.strictEqual(sprintf('%j', 'hello'), '"hello"');
      assert.strictEqual(sprintf('%j', null), 'null');
    });

    it('should handle circular references', () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      assert.strictEqual(sprintf('%j', circular), '[Circular]');
    });
  });

  describe('specifier %b (boolean)', () => {
    it('should convert to true/false', () => {
      assert.strictEqual(sprintf('%b', true), 'true');
      assert.strictEqual(sprintf('%b', false), 'false');
      assert.strictEqual(sprintf('%b', 1), 'true');
      assert.strictEqual(sprintf('%b', 0), 'false');
      assert.strictEqual(sprintf('%b', 'hello'), 'true');
      assert.strictEqual(sprintf('%b', ''), 'false');
      assert.strictEqual(sprintf('%b', null), 'false');
      assert.strictEqual(sprintf('%b', undefined), 'false');
    });
  });

  describe('unknown specifier', () => {
    it('should output literal and not consume argument', () => {
      assert.strictEqual(sprintf('%x', 42), '%x');
      assert.strictEqual(sprintf('%q', 'test'), '%q');
      assert.strictEqual(sprintf('%x %s', 42, 'hello'), '%x 42');
      assert.strictEqual(sprintf('%x', 42, 'extra'), '%x');
    });
  });

  describe('missing arguments', () => {
    it('should keep placeholder', () => {
      assert.strictEqual(sprintf('%s'), '%s');
      assert.strictEqual(sprintf('%d %s', 42), '42 %s');
      assert.strictEqual(sprintf('%d %s %f', 42, 'hello'), '42 hello %f');
    });
  });

  describe('extra arguments', () => {
    it('should ignore extra arguments', () => {
      assert.strictEqual(sprintf('%s', 'hello', 'extra'), 'hello');
      assert.strictEqual(sprintf('%d %s', 42, 'hello', 'extra'), '42 hello');
    });
  });

  describe('edge cases', () => {
    it('should handle empty format', () => {
      assert.strictEqual(sprintf(''), '');
    });

    it('should handle format without specifiers', () => {
      assert.strictEqual(sprintf('hello world'), 'hello world');
    });

    it('should handle mixed specifiers correctly', () => {
      assert.strictEqual(
        sprintf('Name: %s, Age: %d, Score: %f, JSON: %j', 'John', 30, 95.5, {
          x: 1,
        }),
        'Name: John, Age: 30, Score: 95.5, JSON: {"x":1}'
      );
    });
  });
});

// ========== Tes printf ==========
describe('printf', () => {
  let writeCalls: string[] = [];
  let originalWrite: typeof process.stdout.write;

  beforeEach(() => {
    originalWrite = process.stdout.write;
    writeCalls = [];
    process.stdout.write = (chunk: any) => {
      writeCalls.push(String(chunk));
      return true;
    };
  });

  afterEach(() => {
    process.stdout.write = originalWrite;
  });

  it('should call process.stdout.write with formatted string', () => {
    printf('Hello %s', 'world');
    assert.strictEqual(writeCalls[0], 'Hello world');

    printf('Number: %d', 42);
    assert.strictEqual(writeCalls[1], 'Number: 42');

    assert.strictEqual(writeCalls.length, 2);
  });
});
