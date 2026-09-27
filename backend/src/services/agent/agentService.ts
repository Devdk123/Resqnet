import { env } from '../../config/env.js';
import { getIncidentById } from '../../state/store.js';
import { assessSceneRisk, rankResponders } from '../safety/safetyEngine.js';
import { appState } from '../../state/store.js';
import { initialResponders } from '../../data/demoData.js';
import type { AgentRun } from '../../types/index.js';

export async function runAgentAnalysis(incidentId: string, prompt: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    throw new Error('Incident not found');
  }

  const run: AgentRun = {
    id: `agent-run-${Date.now()}`,
    incidentId,
    prompt,
    status: 'running',
    output: {},
    timeline: ['Incident loaded', 'Emergency escalation initiated', 'Scene risk assessed'],
    createdAt: new Date().toISOString()
  };
  appState.agentRuns.unshift(run);

  const risk = assessSceneRisk(incident);
  const ranked = rankResponders(incident, appState.responders);
  const result = {
    incidentId,
    riskLevel: risk.riskLevel,
    dispatchAllowed: risk.volunteerDispatchAllowed,
    recommendedAction: risk.volunteerDispatchAllowed ? 'Dispatch Wave 1 top responders' : 'Professional response remains primary; only safe-distance coordination allowed',
    selectedResponders: ranked.slice(0, 3).map((item) => item.responder.name),
    excludedResponders: appState.responders.filter((responder) => !ranked.some((item) => item.responder.id === responder.id)).map((item) => item.name),
    reasonCodes: risk.reasons,
    nextAction: 'Monitor acceptance and escalate to Wave 2 if necessary',
    requiresHumanReview: true,
    timeline: [...run.timeline, `Evaluated ${ranked.length} responders`, 'Dispatch Wave 1 sent', 'Monitoring acceptance']
  };

  if (env.openAiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.openAiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: env.openAiModel,
          input: [
            {
              role: 'system',
              content: 'You are ARES, an emergency coordination orchestration agent. Preserve emergency service priority, no unrestricted medical diagnosis, no unsafe dispatch, explainable reasoning, and human override.'
            },
            {
              role: 'user',
              content: `Analyze incident ${incident.id}: ${prompt}. Use the tools and return structured JSON with incidentId, riskLevel, dispatchAllowed, recommendedAction, selectedResponders, excludedResponders, reasonCodes, nextAction, requiresHumanReview.`
            }
          ],
          tools: [
            { type: 'function', name: 'get_incident_details', description: 'Get incident details', parameters: { type: 'object', properties: { incidentId: { type: 'string' } }, required: ['incidentId'] } },
            { type: 'function', name: 'assess_scene_risk', description: 'Assess scene risk', parameters: { type: 'object', properties: { incidentId: { type: 'string' } }, required: ['incidentId'] } },
            { type: 'function', name: 'find_available_responders', description: 'List eligible responders', parameters: { type: 'object', properties: { incidentId: { type: 'string' } }, required: ['incidentId'] } }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const outputText = data.output_text || JSON.stringify(data.output || {});
        const parsed = JSON.parse(outputText);
        if (parsed && typeof parsed === 'object') {
          run.output = parsed;
          run.status = 'completed';
          run.timeline = parsed.timeline || run.timeline;
          appState.agentRuns[0] = run;
          return { ...result, source: 'openai', analysis: parsed };
        }
      }
    } catch (error) {
      console.warn('OpenAI agent unavailable, using safe mock mode.', error);
    }
  }

  run.output = result;
  run.status = 'completed';
  appState.agentRuns[0] = run;
  return { ...result, source: 'mock' };
}

export function getDemoResponderData() {
  return initialResponders.slice(0, 12).map((responder) => ({
    id: responder.id,
    name: responder.name,
    eta: responder.etaMinutes,
    training: responder.trainingValid ? 'Valid' : 'Expired',
    access: responder.directAccess ? 'Direct' : 'Restricted',
    availability: responder.available ? 'Available' : 'Unavailable',
    score: responder.score
  }));
}
