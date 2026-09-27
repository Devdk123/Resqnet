import type { Incident, Responder, RiskLevel } from '../../types/index.js';

const weights = {
  eta: 35,
  routeAccessibility: 25,
  trainingValidity: 15,
  availability: 10,
  roleFit: 10,
  environment: 5
};

export function assessSceneRisk(incident: Incident): { riskLevel: RiskLevel; hazards: string[]; volunteerDispatchAllowed: boolean; reasons: string[] } {
  const hazards: string[] = [];
  const reasons: string[] = [];

  if (incident.type === 'Fire' || incident.hazardSummary.toLowerCase().includes('fire')) {
    hazards.push('fire');
    reasons.push('Fire risk present in the scene');
  }
  if (incident.hazardSummary.toLowerCase().includes('fuel') || incident.hazardSummary.toLowerCase().includes('leak')) {
    hazards.push('fuel leakage');
    reasons.push('Fuel or hazardous material risk detected');
  }
  if (incident.hazardSummary.toLowerCase().includes('traffic')) {
    hazards.push('active traffic hazard');
    reasons.push('Traffic hazard requires professional traffic management');
  }
  if (incident.hazardSummary.toLowerCase().includes('unstable') || incident.severity === 'CRITICAL') {
    hazards.push('unstable structure');
    reasons.push('Scene structure may be unstable');
  }

  const hasCriticalCondition = hazards.some((hazard) => ['fire', 'fuel leakage', 'unstable structure'].includes(hazard));
  const riskLevel: RiskLevel = hasCriticalCondition || incident.severity === 'CRITICAL'
    ? 'CRITICAL'
    : incident.severity === 'HIGH'
      ? 'HIGH'
      : incident.severity === 'MEDIUM'
        ? 'MODERATE'
        : 'LOW';

  const volunteerDispatchAllowed = !(riskLevel === 'HIGH' || riskLevel === 'CRITICAL');

  if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
    reasons.push('Normal volunteer dispatch is blocked by a high-risk scene safety gate.');
  }

  return { riskLevel, hazards, volunteerDispatchAllowed, reasons };
}

export function computeResponderSuitability(responder: Responder, incident: Incident): { eligible: boolean; score: number; reasons: string[] } {
  const reasons: string[] = [];

  const risk = assessSceneRisk(incident);
  if (risk.riskLevel === 'HIGH' || risk.riskLevel === 'CRITICAL') {
    if (responder.responseMode === 'Volunteer') {
      return { eligible: false, score: 0, reasons: ['High-risk scene blocks volunteer dispatch.'] };
    }
  }

  if (!responder.available || !responder.trainingValid) {
    return { eligible: false, score: 0, reasons: ['Responder is unavailable or training is invalid.'] };
  }

  if (!responder.safeRoute) {
    return { eligible: false, score: 0, reasons: ['Safe route is unavailable.'] };
  }

  const etaScore = Math.max(0, 100 - responder.etaMinutes * 8);
  const accessScore = responder.directAccess ? 100 : 55;
  const trainingScore = responder.trainingValid ? 100 : 0;
  const availabilityScore = responder.available ? 100 : 0;
  const roleScore = responder.role.toLowerCase().includes('medical') || responder.role.toLowerCase().includes('first aid') ? 100 : 80;
  const environmentScore = incident.weather?.rain ? 90 : 100;

  const total = (
    (etaScore * weights.eta) / 100 +
    (accessScore * weights.routeAccessibility) / 100 +
    (trainingScore * weights.trainingValidity) / 100 +
    (availabilityScore * weights.availability) / 100 +
    (roleScore * weights.roleFit) / 100 +
    (environmentScore * weights.environment) / 100
  );

  reasons.push(`ETA ${responder.etaMinutes} min`, responder.directAccess ? 'Direct access available' : 'Access route is restricted', 'Training validity confirmed');

  return { eligible: true, score: Number(total.toFixed(1)), reasons };
}

export function rankResponders(incident: Incident, responders: Responder[]) {
  const ranked = responders
    .map((responder) => ({
      responder,
      ...computeResponderSuitability(responder, incident)
    }))
    .filter((entry) => entry.eligible)
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      rank: index + 1,
      responder: entry.responder,
      eta: `${entry.responder.etaMinutes} min`,
      distance: `${entry.responder.distanceKm.toFixed(1)} km`,
      training: entry.responder.trainingValid ? 'Valid' : 'Expired',
      access: entry.responder.directAccess ? 'Direct' : 'Restricted',
      availability: entry.responder.available ? 'Available' : 'Busy',
      suitability: entry.score >= 85 ? 'High' : entry.score >= 70 ? 'Medium' : 'Low',
      score: entry.score,
      reasons: entry.reasons
    }));

  return ranked;
}

export function buildDispatchWave(responders: Responder[], incident: Incident, wave = 1) {
  const eligible = rankResponders(incident, responders);
  const waveSize = wave === 1 ? 3 : 4;
  return eligible.slice(0, waveSize).map((entry) => ({
    ...entry,
    dispatchWave: wave,
    incidentId: incident.id
  }));
}
