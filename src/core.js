const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const NORMALIZED = new Map([
  ['O', '0'], ['o', '0'],
  ['I', '1'], ['i', '1'], ['L', '1'], ['l', '1'],
  ['U', 'V'], ['u', 'V'],
]);
const DECODE_MAP = new Map();
for (let i = 0; i < ALPHABET.length; i++) {
  DECODE_MAP.set(ALPHABET[i], i);
  if (ALPHABET[i] >= 'A' && ALPHABET[i] <= 'Z') {
    DECODE_MAP.set(ALPHABET[i].toLowerCase(), i);
  }
}
for (const [from, to] of NORMALIZED) {
  DECODE_MAP.set(from, DECODE_MAP.get(to));
}

export function encode(buffer) {
  if (!(buffer instanceof Uint8Array)) {
    throw new TypeError('encode: expected a Uint8Array');
  }
  if (buffer.length === 0) return '';
  let bits = 0;
  let value = 0;
  let out = '';
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 0x1f];
      bits -= 5;
    }
  }
  if (bits > 0) {
    out += ALPHABET[(value << (5 - bits)) & 0x1f];
  }
  return out;
}

export function decode(str) {
  if (typeof str !== 'string') {
    throw new TypeError('decode: expected a string');
  }
  if (str.length === 0) return new Uint8Array(0);
  const bytes = [];
  let bits = 0;
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    let v = DECODE_MAP.get(ch);
    if (v === undefined) {
      throw new Error(`decode: invalid character '${ch}' at position ${i}`);
    }
    value = (value << 5) | v;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  const trailing = (value & ((1 << bits) - 1));
  if (bits > 0 && trailing !== 0) {
    throw new Error('decode: non-zero trailing bits');
  }
  return new Uint8Array(bytes);
}
