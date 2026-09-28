import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/index.js';

test('empty buffer encodes to empty string', () => {
  assert.equal(encode(new Uint8Array(0)), '');
});

test('empty string decodes to empty buffer', () => {
  assert.deepEqual(decode(''), new Uint8Array(0));
});

test('single byte 0x00 encodes to 00', () => {
  assert.equal(encode(new Uint8Array([0x00])), '00');
});

test('single byte 0x5A encodes to B8', () => {
  assert.equal(encode(new Uint8Array([0x5a])), 'B8');
});

test('single byte 0xFF encodes to ZW', () => {
  assert.equal(encode(new Uint8Array([0xff])), 'ZW');
});

test('two bytes encodes to four characters', () => {
  assert.equal(encode(new Uint8Array([0x12, 0x34])), '28T0');
});

test('three bytes encodes to five characters', () => {
  assert.equal(encode(new Uint8Array([0x12, 0x34, 0x56])), '28T5C');
});

test('five bytes encodes to exactly eight characters', () => {
  assert.equal(encode(new Uint8Array([0x12, 0x34, 0x56, 0x78, 0x9a])), '28T5CY4T');
});

test('roundtrip preserves arbitrary bytes', () => {
  const input = new Uint8Array([0x00, 0x01, 0x02, 0x7f, 0x80, 0xff, 0xaa, 0x55]);
  assert.deepEqual(decode(encode(input)), input);
});

test('decode accepts lowercase', () => {
  assert.deepEqual(decode('b8'), new Uint8Array([0x5a]));
});

test('decode normalizes O to 0', () => {
  assert.deepEqual(decode('O0'), new Uint8Array([0x00]));
});

test('decode normalizes I and L to 1', () => {
  assert.deepEqual(decode('18'), decode('L8'));
});

test('decode normalizes U to V', () => {
  assert.deepEqual(decode('V8'), decode('U8'));
});

test('decode rejects invalid characters', () => {
  assert.throws(() => decode('!@'), /invalid character/);
});

test('decode rejects non-zero trailing bits', () => {
  assert.throws(() => decode('01'), /non-zero trailing bits/);
});

test('encode rejects non-Uint8Array', () => {
  assert.throws(() => encode([1, 2, 3]), TypeError);
});

test('decode rejects non-string', () => {
  assert.throws(() => decode(123), TypeError);
});
