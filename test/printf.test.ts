import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as util from 'util';
import { sprintf, printf } from '../src/io/printf.ts';

describe('sprintf', () => {
  describe('escape %%', () => {
    it('should output single percent', () => {
      expect(sprintf('%%')).toBe('%');
      expect(sprintf('%% %%')).toBe('% %');
    });

    it('should not treat %% as specifier', () => {
      expect(sprintf('%%s')).toBe('%s');
      expect(sprintf('10%%')).toBe('10%');
    });
  });

  describe('specifier %s', () => {
    it('should convert to string', () => {
      expect(sprintf('%s', 'hello')).toBe('hello');
      expect(sprintf('%s', 123)).toBe('123');
      expect(sprintf('%s', null)).toBe('null');
      expect(sprintf('%s', undefined)).toBe('undefined');
      expect(sprintf('%s', {})).toBe('[object Object]');
      expect(sprintf('%s', [1, 2])).toBe('1,2');
    });
  });

  describe('specifiers %d and %i', () => {
    it('should parse integer', () => {
      expect(sprintf('%d', 42)).toBe('42');
      expect(sprintf('%i', 42.7)).toBe('42');
      expect(sprintf('%d', '42')).toBe('42');
      expect(sprintf('%d', '42.7')).toBe('42');
      expect(sprintf('%d', 'abc')).toBe('NaN');
      expect(sprintf('%d', null)).toBe('NaN');
      expect(sprintf('%d', undefined)).toBe('NaN');
      expect(sprintf('%d', true)).toBe('NaN');
      expect(sprintf('%d', false)).toBe('NaN');
    });
  });

  describe('specifier %f', () => {
    it('should parse float', () => {
      expect(sprintf('%f', 42.7)).toBe('42.7');
      expect(sprintf('%f', '42.7')).toBe('42.7');
      expect(sprintf('%f', '42')).toBe('42');
      expect(sprintf('%f', 'abc')).toBe('NaN');
      expect(sprintf('%f', null)).toBe('NaN');
      expect(sprintf('%f', undefined)).toBe('NaN');
    });
  });

  describe('specifiers %o and %O', () => {
    it('should inspect object with util.inspect', () => {
      const obj = { a: 1, b: 'test' };
      const expected = util.inspect(obj, { showHidden: false, depth: null, colors: false });
      expect(sprintf('%o', obj)).toBe(expected);
      expect(sprintf('%O', obj)).toBe(expected);
    });

    it('should inspect array', () => {
      const arr = [1, 2, 3];
      const expected = util.inspect(arr, { showHidden: false, depth: null, colors: false });
      expect(sprintf('%o', arr)).toBe(expected);
    });
  });

  describe('specifier %j (JSON)', () => {
    it('should stringify JSON', () => {
      expect(sprintf('%j', { a: 1, b: 'test' })).toBe('{"a":1,"b":"test"}');
      expect(sprintf('%j', [1, 2])).toBe('[1,2]');
      expect(sprintf('%j', 'hello')).toBe('"hello"');
      expect(sprintf('%j', null)).toBe('null');
    });

    it('should handle circular references', () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      expect(sprintf('%j', circular)).toBe('[Circular]');
    });
  });

  describe('specifier %b (boolean)', () => {
    it('should convert to true/false', () => {
      expect(sprintf('%b', true)).toBe('true');
      expect(sprintf('%b', false)).toBe('false');
      expect(sprintf('%b', 1)).toBe('true');
      expect(sprintf('%b', 0)).toBe('false');
      expect(sprintf('%b', 'hello')).toBe('true');
      expect(sprintf('%b', '')).toBe('false');
      expect(sprintf('%b', null)).toBe('false');
      expect(sprintf('%b', undefined)).toBe('false');
    });
  });

  describe('unknown specifier', () => {
    it('should output literal and not consume argument', () => {
      // Specifier tidak dikenal: output literal dan tidak mengurangi argIndex
      expect(sprintf('%x', 42)).toBe('%x');
      expect(sprintf('%q', 'test')).toBe('%q');

      // %x tidak mengonsumsi 42, sehingga %s memakai 42, bukan 'hello'
      expect(sprintf('%x %s', 42, 'hello')).toBe('%x 42');

      // Argumen ekstra diabaikan
      expect(sprintf('%x', 42, 'extra')).toBe('%x');
    });
  });

  describe('missing arguments', () => {
    it('should keep placeholder', () => {
      expect(sprintf('%s')).toBe('%s');
      expect(sprintf('%d %s', 42)).toBe('42 %s');
      expect(sprintf('%d %s %f', 42, 'hello')).toBe('42 hello %f');
    });
  });

  describe('extra arguments', () => {
    it('should ignore extra arguments', () => {
      expect(sprintf('%s', 'hello', 'extra')).toBe('hello');
      expect(sprintf('%d %s', 42, 'hello', 'extra')).toBe('42 hello');
    });
  });

  describe('edge cases', () => {
    it('should handle empty format', () => {
      expect(sprintf('')).toBe('');
    });

    it('should handle format without specifiers', () => {
      expect(sprintf('hello world')).toBe('hello world');
    });

    it('should handle mixed specifiers correctly', () => {
      expect(sprintf('Name: %s, Age: %d, Score: %f, JSON: %j', 'John', 30, 95.5, { x: 1 }))
        .toBe('Name: John, Age: 30, Score: 95.5, JSON: {"x":1}');
    });
  });
});

describe('printf', () => {
  let writeSpy: any;

  beforeEach(() => {
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('should call process.stdout.write with formatted string', () => {
    printf('Hello %s', 'world');
    expect(writeSpy).toHaveBeenCalledWith('Hello world');

    printf('Number: %d', 42);
    expect(writeSpy).toHaveBeenCalledWith('Number: 42');

    // Pastikan tidak ada newline tambahan
    expect(writeSpy).toHaveBeenCalledTimes(2);
  });
});
