function isMeaningfulMessage(value: string) {
  const trimmed = value.trim();
  return Boolean(trimmed) && trimmed !== '[object Object]';
}

export function toReadableErrorMessage(error: unknown, fallback = 'Unexpected error'): string {
  if (typeof error === 'string' && isMeaningfulMessage(error)) {
    return error;
  }

  if (error instanceof Error) {
    if (isMeaningfulMessage(error.message || '')) {
      return error.message;
    }

    const maybePayload = (error as Error & { cause?: unknown }).cause;
    if (maybePayload && typeof maybePayload === 'object') {
      const nested = (maybePayload as Record<string, unknown>).message;
      if (typeof nested === 'string' && isMeaningfulMessage(nested)) {
        return nested;
      }
    }
  }

  if (error && typeof error === 'object') {
    const payload = error as Record<string, unknown>;
    const candidates = [payload.reason, payload.error, payload.message];

    for (const candidate of candidates) {
      if (typeof candidate === 'string' && isMeaningfulMessage(candidate)) {
        return candidate;
      }

      if (candidate && typeof candidate === 'object') {
        const nested = (candidate as Record<string, unknown>).message;
        if (typeof nested === 'string' && isMeaningfulMessage(nested)) {
          return nested;
        }

        try {
          const serialized = JSON.stringify(candidate);
          if (serialized && serialized !== '{}') {
            return serialized;
          }
        } catch {
          // Ignore serialization failures and continue to fallback.
        }
      }
    }

    try {
      const serialized = JSON.stringify(payload);
      if (serialized && serialized !== '{}') {
        return serialized;
      }
    } catch {
      // Ignore serialization failures.
    }
  }

  return fallback;
}
