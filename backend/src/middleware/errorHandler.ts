import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Resource not found' }, requestId: crypto.randomUUID() });
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = 'statusCode' in err ? Number((err as { statusCode?: number }).statusCode || 500) : 500;
  res.status(status).json({
    success: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
    },
    requestId: crypto.randomUUID()
  });
}
