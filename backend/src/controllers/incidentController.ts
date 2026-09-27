import { appState, getIncidentById } from '../state/store.js';
import { assessSceneRisk, buildDispatchWave, rankResponders } from '../services/safety/safetyEngine.js';
import { createEmergencyEvent } from '../services/emergency/emergencyService.js';
import { sendAlert } from '../services/notification/notificationService.js';
import { buildResponse } from '../utils/api.js';
import { saveIncident } from '../services/database/supabase.js';
import type { Incident } from '../types/index.js';

export function listIncidents() {
  return buildResponse(appState.incidents);
}

export function getIncident(incidentId: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return buildResponse(null, { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
  }

  return buildResponse(incident);
}

export async function createIncident(input: Partial<Incident>) {
  const incident: Incident = {
    id: `INC-${Date.now()}`,
    type: input.type || 'Road Accident',
    title: input.title || 'Reported incident',
    description: input.description || 'Emergency response required',
    location: input.location || { lat: 12.9614, lng: 77.5844 },
    landmark: input.landmark || 'Public road',
    roadName: input.roadName || 'Main Road',
    roadSide: input.roadSide || 'Right Side',
    flyoverLevel: input.flyoverLevel || 'Level 1',
    hazardSummary: input.hazardSummary || 'No hazards reported',
    affectedPersons: input.affectedPersons || 1,
    notes: input.notes || '',
    status: 'REPORTED',
    severity: input.severity || 'MEDIUM',
    verificationStatus: 'PENDING',
    riskLevel: 'LOW',
    emergencyServiceStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const risk = assessSceneRisk(incident);
  incident.riskLevel = risk.riskLevel;
  incident.status = 'VERIFYING';
  incident.emergencyServiceStatus = 'Emergency Service Alert: SENT';

  await saveIncident(incident);
  appState.incidents.unshift(incident);
  createEmergencyEvent(incident.id);

  return buildResponse({
    incident,
    emergencyService: { status: 'Emergency Service Alert: SENT' },
    responderCoordination: { status: 'Queued for analysis', risk }
  });
}

export async function verifyIncident(incidentId: string, notes: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return buildResponse(null, { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
  }

  const updatedIncident = {
    ...incident,
    verificationStatus: 'VERIFIED' as const,
    status: 'VERIFIED' as const,
    notes,
    updatedAt: new Date().toISOString()
  };
  await saveIncident(updatedIncident);
  Object.assign(incident, updatedIncident);

  return buildResponse({
    incidentId,
    verified: true,
    notes,
    status: incident.status
  });
}

export async function analyzeIncident(incidentId: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return buildResponse(null, { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
  }

  const risk = assessSceneRisk(incident);
  const updatedIncident = { ...incident, riskLevel: risk.riskLevel, status: 'ASSESSING' as const, updatedAt: new Date().toISOString() };
  await saveIncident(updatedIncident);
  Object.assign(incident, updatedIncident);
  const ranked = rankResponders(incident, appState.responders);
  return buildResponse({
    incidentId,
    risk,
    rankedResponders: ranked,
    status: 'ASSESSING'
  });
}

export async function dispatchIncident(incidentId: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return buildResponse(null, { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
  }

  const updatedIncident = { ...incident, status: 'DISPATCHING' as const, updatedAt: new Date().toISOString() };
  await saveIncident(updatedIncident);
  Object.assign(incident, updatedIncident);
  const ranked = buildDispatchWave(appState.responders, incident, 1);
  ranked.forEach((item) => {
    const responder = appState.responders.find((entry) => entry.id === item.responder.id);
    if (responder) {
      responder.status = 'En Route';
      sendAlert(responder.id, incidentId, 1);
    }
  });

  return buildResponse({
    incidentId,
    dispatchWave: 1,
    selectedResponders: ranked.map((item) => item.responder.name),
    status: 'DISPATCHING'
  });
}

export async function cancelDispatch(incidentId: string) {
  const incident = getIncidentById(incidentId);
  if (!incident) {
    return buildResponse(null, { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' });
  }

  const updatedIncident = { ...incident, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() };
  await saveIncident(updatedIncident);
  Object.assign(incident, updatedIncident);
  return buildResponse({ incidentId, status: 'CANCELLED' });
}
