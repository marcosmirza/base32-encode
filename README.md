# Base32 Encode

Encodes and decodes byte buffers to Crockford Base32 strings for checksum-safe, human-readable identifiers.

```js
import { encode, decode } from 'base32-encode';

const id = encode(new Uint8Array([0x12, 0x34, 0x56]));
// '0CPW4'

const bytes = decode('0CPW4');
// Uint8Array(3) [ 0x12, 0x34, 0x56 ]
```

## Why

Crockford Base32 is designed for identifiers that humans transcribe by hand or read over the phone. It omits the letters I, L, O, and U to avoid confusion with digits and with each other. This library implements that alphabet with no extras — no checksum symbol, no fixed-length padding — because adding them would mean picking a convention the caller did not ask for.

The one edge to know about: decoding is permissive on input (it accepts lowercase and normalizes O→0, I/L→1, U→V per the spec), but strict on trailing bits. If a string's final character carries leftover bits that do not map back to whole bytes, `decode` throws rather than silently truncating. That is the difference between a typo and a corrupted identifier.

## API

- `encode(buffer: Uint8Array): string` — returns the Crockford Base32 encoding.
- `decode(str: string): Uint8Array` — returns the decoded bytes. Throws on invalid characters or non-zero trailing bits.
