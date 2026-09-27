import { appState } from '../../state/store.js';

export function createEmergencyEvent(incidentId: string) {
  const event = {
    id: `evt-${Date.now()}`,
    incidentId,
    status: 'Dispatcher Received',
    createdAt: new Date().toISOString()
  };

  appState.emergencyEvents.push(event);
  return event;
}

export function advanceEmergencySimulation(incidentId: string) {
  const events = appState.emergencyEvents.filter((item) => item.incidentId === incidentId);
  const currentIndex = events.length;
  const statuses = ['Dispatcher Received', 'Unit Assigned', 'ETA Updated', 'Unit En Route', 'Arrived', 'Handover'];

  if (events.length === 0) {
    return createEmergencyEvent(incidentId);
  }

  const next = statuses[Math.min(currentIndex, statuses.length - 1)];
  const event = {
    id: `evt-${Date.now()}`,
    incidentId,
    status: next,
    createdAt: new Date().toISOString()
  };
  appState.emergencyEvents.push(event);
  return event;
}
