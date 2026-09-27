import { initialIncidents, initialResponders } from '../data/demoData.js';
import { loadIncidents } from '../services/database/supabase.js';
import type { AgentRun, Incident, NotificationRecord, Responder } from '../types/index.js';

export const appState = {
  incidents: [...initialIncidents] as Incident[],
  responders: [...initialResponders] as Responder[],
  notifications: [] as NotificationRecord[],
  agentRuns: [] as AgentRun[],
  auditLogs: [] as Array<{ id: string; actor: string; action: string; incidentId?: string; metadata: Record<string, unknown>; createdAt: string }>,
  emergencyEvents: [] as Array<{ id: string; incidentId: string; status: string; etaMinutes?: number; createdAt: string }>
};

export async function initializeStore() {
  const incidents = await loadIncidents();
  if (incidents) appState.incidents.splice(0, appState.incidents.length, ...incidents);
}

export function getIncidentById(incidentId: string) {
  return appState.incidents.find((item) => item.id === incidentId);
}

export function getResponderById(responderId: string) {
  return appState.responders.find((item) => item.id === responderId);
}
