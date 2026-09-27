import { demoScenarioDefinitions } from '../data/demoData.js';
import { appState } from '../state/store.js';
import { buildResponse } from '../utils/api.js';

export function listScenarios() {
  return buildResponse(demoScenarioDefinitions);
}

export function runScenario(scenarioId: string) {
  const scenario = demoScenarioDefinitions.find((item) => item.id === scenarioId);
  if (!scenario) {
    return buildResponse(null, { code: 'SCENARIO_NOT_FOUND', message: 'Scenario not found' });
  }

  const incident = appState.incidents[0];
  return buildResponse({
    scenario,
    incident,
    status: 'Simulated / Demo Data',
    timeline: [
      'Incident received',
      'Emergency escalation initiated',
      'Scene risk assessed',
      'Topology analyzed',
      'Wave 1 responders dispatched',
      'Replan triggered after decline'
    ]
  });
}
