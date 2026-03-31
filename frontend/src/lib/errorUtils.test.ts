import { describe, expect, it } from 'vitest';
import { toReadableErrorMessage } from './errorUtils';

describe('toReadableErrorMessage', () => {
  it('extracts nested message from API-style payload', () => {
    const errorPayload = {
      reason: {
        message: 'Contract simulation failed',
      },
    };

    const value = toReadableErrorMessage(errorPayload, 'fallback');
    expect(value).toBe('Contract simulation failed');
  });

  it('ignores [object Object] and returns fallback message', () => {
    const value = toReadableErrorMessage('[object Object]', 'Unexpected mint error');
    expect(value).toBe('Unexpected mint error');
  });

  it('returns cause.message when provided on Error object', () => {
    const error = new Error('[object Object]') as Error & {
      cause?: { message?: string };
    };
    error.cause = { message: 'Wallet rejected transaction signing' };

    const value = toReadableErrorMessage(error, 'fallback');
    expect(value).toBe('Wallet rejected transaction signing');
  });
});
