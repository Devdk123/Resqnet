import { appState } from '../../state/store.js';

export function getAnalytics() {
  const incidents = appState.incidents.length;
  const verified = appState.incidents.filter((incident) => incident.verificationStatus === 'VERIFIED').length;
  const pending = appState.incidents.length - verified;

  return {
    incidentVolume: [
      { name: 'Mon', value: 17 },
      { name: 'Tue', value: 22 },
      { name: 'Wed', value: 19 },
      { name: 'Thu', value: 27 },
      { name: 'Fri', value: 30 },
      { name: 'Sat', value: 26 }
    ],
    verificationRate: Number(((verified / Math.max(incidents, 1)) * 100).toFixed(0)),
    responseEta: [
      { name: 'Wave 1', value: 6 },
      { name: 'Wave 2', value: 10 },
      { name: 'Wave 3', value: 14 }
    ],
    acceptanceRate: 82,
    dispatchSuccessRate: 88,
    falseDispatchCount: 2,
    unsafeDispatchPrevention: 7,
    averageHandoverTime: 12,
    responderAvailability: 84,
    locationCorrectionFrequency: 3,
    demoMode: true,
    activeIncidents: appState.incidents.filter((incident) => incident.status !== 'RESOLVED').length,
    pendingVerification: pending
  };
}
