import { afterEach } from 'vitest';
import { webcrypto } from 'node:crypto';

afterEach(() => {
  vi.clearAllMocks();
});

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

