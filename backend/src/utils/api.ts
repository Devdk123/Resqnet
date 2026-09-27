import { randomUUID } from 'crypto';

export function buildResponse<T>(data: T, error: { code: string; message: string } | null = null) {
  return {
    success: !error,
    data,
    error,
    requestId: randomUUID()
  };
}
