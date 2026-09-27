import { getAnalytics } from '../services/analytics/analyticsService.js';
import { buildResponse } from '../utils/api.js';

export function analytics() {
  return buildResponse(getAnalytics());
}
