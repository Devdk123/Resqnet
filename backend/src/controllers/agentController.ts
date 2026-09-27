import { runAgentAnalysis } from '../services/agent/agentService.js';
import { appState, getIncidentById } from '../state/store.js';
import { buildResponse } from '../utils/api.js';

export async function runAgent(req: { body: { incidentId: string; prompt?: string } }) {
  const incidentId = req.body.incidentId;
  const prompt = req.body.prompt || 'Create a response plan';
  try {
    const result = await runAgentAnalysis(incidentId, prompt);
    return buildResponse(result);
  } catch (error: unknown) {
    return buildResponse(null, {
      code: 'AGENT_RUN_FAILED',
      message: error instanceof Error ? error.message : 'Agent run failed'
    });
  }
}

export function getAgentRuns() {
  return buildResponse(appState.agentRuns);
}

export function getAgentRun(runId: string) {
  const run = appState.agentRuns.find((item) => item.id === runId);
  if (!run) {
    return buildResponse(null, { code: 'RUN_NOT_FOUND', message: 'Agent run not found' });
  }
  return buildResponse(run);
}

export function getAgentTools() {
  return buildResponse([
    { name: 'get_incident_details', status: 'ready' },
    { name: 'verify_incident', status: 'ready' },
    { name: 'assess_scene_risk', status: 'ready' },
    { name: 'get_weather', status: 'ready' },
    { name: 'get_route', status: 'ready' },
    { name: 'find_available_responders', status: 'ready' },
    { name: 'rank_responders', status: 'ready' },
    { name: 'send_responder_alert', status: 'ready' },
    { name: 'cancel_responder_alert', status: 'ready' },
    { name: 'get_response_status', status: 'ready' },
    { name: 'update_incident_status', status: 'ready' },
    { name: 'create_audit_log', status: 'ready' }
  ]);
}

export function chat(req: { body: { message: string; incidentId?: string } }) {
  const incident = req.body.incidentId ? getIncidentById(req.body.incidentId) : null;
  return buildResponse({
    actor: 'ARES',
    message: req.body.message,
    incident, 
    response: incident
      ? `I analyzed ${incident.id}. The scene risk is ${incident.riskLevel} and the recommended action is controlled dispatch with emergency-service priority.`
      : 'I can help with incident assessment, responder ranking, and dispatch planning.'
  });
}
