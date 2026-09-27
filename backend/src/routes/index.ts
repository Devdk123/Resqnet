import { Router } from 'express';
import { env } from '../config/env.js';
import { listIncidents, getIncident, createIncident, verifyIncident, analyzeIncident, dispatchIncident, cancelDispatch } from '../controllers/incidentController.js';
import { listResponders, getResponder, updateAvailability, acceptIncident, declineIncident, updateResponderStatus } from '../controllers/responderController.js';
import { runAgent, getAgentRuns, getAgentRun, getAgentTools, chat } from '../controllers/agentController.js';
import { analytics } from '../controllers/analyticsController.js';
import { listScenarios, runScenario } from '../controllers/demoController.js';
import { getAnalytics } from '../services/analytics/analyticsService.js';
import { getRoute } from '../services/routing/routingService.js';
import { getWeather } from '../services/weather/weatherService.js';
import { appState } from '../state/store.js';
import type { NextFunction, Request, Response } from 'express';

const router = Router();
const asyncHandler = (handler: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res).catch(next);
  };

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'resqnet-api' });
});

router.get('/api/incidents', (_req, res) => {
  res.json(listIncidents());
});

router.post('/api/incidents', asyncHandler(async (req, res) => {
  const response = await createIncident(req.body || {});
  res.status(201).json(response);
}));

router.get('/api/incidents/:id', (req, res) => {
  res.json(getIncident(req.params.id));
});

router.post('/api/incidents/:id/verify', asyncHandler(async (req, res) => {
  res.json(await verifyIncident(String(req.params.id), req.body?.notes || 'Verified by operator'));
}));

router.post('/api/incidents/:id/analyze', asyncHandler(async (req, res) => {
  res.json(await analyzeIncident(String(req.params.id)));
}));

router.post('/api/incidents/:id/dispatch', asyncHandler(async (req, res) => {
  res.json(await dispatchIncident(String(req.params.id)));
}));

router.post('/api/incidents/:id/cancel-dispatch', asyncHandler(async (req, res) => {
  res.json(await cancelDispatch(String(req.params.id)));
}));

router.get('/api/responders', (_req, res) => {
  res.json(listResponders());
});

router.get('/api/responders/available', (_req, res) => {
  res.json({
    success: true,
    data: appState.responders.filter((item) => item.available),
    error: null,
    requestId: crypto.randomUUID()
  });
});

router.get('/api/responders/:id', (req, res) => {
  res.json(getResponder(req.params.id));
});

router.patch('/api/responders/:id/availability', (req, res) => {
  res.json(updateAvailability(req.params.id, Boolean(req.body?.available)));
});

router.post('/api/responders/:id/accept', (req, res) => {
  res.json(acceptIncident(req.params.id, req.body?.incidentId || 'INC-1001'));
});

router.post('/api/responders/:id/decline', (req, res) => {
  res.json(declineIncident(req.params.id, req.body?.incidentId || 'INC-1001'));
});

router.post('/api/responders/:id/status', (req, res) => {
  res.json(updateResponderStatus(req.params.id, req.body?.status || 'Available'));
});

router.get('/api/routes', async (_req, res) => {
  const result = await getRoute({ lat: 12.9614, lng: 77.5844 }, { lat: 12.9585, lng: 77.5817 }, 'driving');
  res.json({ success: true, data: result, error: null, requestId: crypto.randomUUID() });
});

router.get('/api/weather', async (req, res) => {
  const latitude = Number(req.query.latitude || 12.9614);
  const longitude = Number(req.query.longitude || 77.5844);
  res.json({ success: true, data: await getWeather(latitude, longitude), error: null, requestId: crypto.randomUUID() });
});

router.post('/api/agent/run', async (req, res) => {
  const result = await runAgent(req);
  res.json(result);
});

router.post('/api/agent/chat', (req, res) => {
  res.json(chat(req));
});

router.get('/api/agent/runs', (_req, res) => {
  res.json(getAgentRuns());
});

router.get('/api/agent/runs/:id', (req, res) => {
  res.json(getAgentRun(req.params.id));
});

router.get('/api/agent/runs/:id/tools', (_req, res) => {
  res.json({ success: true, data: [{ name: 'get_incident_details', link: '/api/incidents/INC-1001' }], error: null, requestId: crypto.randomUUID() });
});

router.get('/api/analytics', (_req, res) => {
  res.json(analytics());
});

router.get('/api/audit-logs', (_req, res) => {
  res.json({
    success: true,
    data: appState.auditLogs,
    error: null,
    requestId: crypto.randomUUID()
  });
});

router.get('/api/demo/scenarios', (_req, res) => {
  res.json(listScenarios());
});

router.post('/api/demo/scenarios/:scenarioId/run', (req, res) => {
  res.json(runScenario(req.params.scenarioId));
});

router.get('/api/integrations', (_req, res) => {
  res.json({
    success: true,
    data: {
      openai: env.openAiApiKey ? 'Configured' : 'Not Configured',
      mapbox: env.mapboxAccessToken ? 'Configured' : 'Mock Mode',
      supabase: env.supabaseUrl && env.supabaseSecretKey ? 'Configured' : 'Not Configured',
      weather: env.weatherProvider ? 'Configured' : 'Mock Mode',
      notificationProvider: env.notificationProvider||'in_app',
      emergencyService: env.emergencyServiceMode || 'mock'
    },
    error: null,
    requestId: crypto.randomUUID()
  });
});

export { router };
