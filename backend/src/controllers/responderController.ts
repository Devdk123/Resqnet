import { appState, getResponderById } from '../state/store.js';
import { buildResponse } from '../utils/api.js';

export function listResponders() {
  return buildResponse(appState.responders);
}

export function getResponder(responderId: string) {
  const responder = getResponderById(responderId);
  if (!responder) {
    return buildResponse(null, { code: 'RESPONDER_NOT_FOUND', message: 'Responder not found' });
  }
  return buildResponse(responder);
}

export function updateAvailability(responderId: string, available: boolean) {
  const responder = getResponderById(responderId);
  if (!responder) {
    return buildResponse(null, { code: 'RESPONDER_NOT_FOUND', message: 'Responder not found' });
  }

  responder.available = available;
  responder.status = available ? 'Available' : 'Unavailable';
  return buildResponse({ responderId, available, status: responder.status });
}

export function acceptIncident(responderId: string, incidentId: string) {
  const responder = getResponderById(responderId);
  if (!responder) {
    return buildResponse(null, { code: 'RESPONDER_NOT_FOUND', message: 'Responder not found' });
  }
  responder.status = 'En Route';
  responder.available = false;
  return buildResponse({ responderId, incidentId, accepted: true, status: 'ACCEPTED' });
}

export function declineIncident(responderId: string, incidentId: string) {
  const responder = getResponderById(responderId);
  if (!responder) {
    return buildResponse(null, { code: 'RESPONDER_NOT_FOUND', message: 'Responder not found' });
  }
  responder.status = 'Available';
  responder.available = true;
  return buildResponse({ responderId, incidentId, accepted: false, status: 'DECLINED' });
}

export function updateResponderStatus(responderId: string, status: string) {
  const responder = getResponderById(responderId);
  if (!responder) {
    return buildResponse(null, { code: 'RESPONDER_NOT_FOUND', message: 'Responder not found' });
  }
  responder.status = status as typeof responder.status;
  return buildResponse({ responderId, status });
}
