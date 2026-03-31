import { describe, expect, it } from 'vitest';
import { cn, shortenAddress } from './utils';

describe('shortenAddress', () => {
  it('shortens long wallet addresses with default bounds', () => {
    const value = shortenAddress('GABCDEF1234567890XYZ');
    expect(value).toBe('GABC...0XYZ');
  });

  it('returns original address when string is already short', () => {
    const value = shortenAddress('GABCD');
    expect(value).toBe('GABCD');
  });
});

describe('cn', () => {
  it('joins truthy classes and omits falsey values', () => {
    const value = cn('btn', undefined, null, false, 'primary');
    expect(value).toBe('btn primary');
  });
});
