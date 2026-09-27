import { describe, expect, it } from 'vitest';
import { assessSceneRisk, computeResponderSuitability, rankResponders } from './safetyEngine.js';
import type { Incident, Responder } from '../../types/index.js';

const baseIncident: Incident = {
  id: 'INC-1001',
  type: 'Vehicle Collision',
  title: 'Traffic incident',
  description: 'Vehicle damage on road',
  location: { lat: 12.9614, lng: 77.5844 },
  landmark: 'City Ring Road',
  roadName: 'Outer Ring Road',
  roadSide: 'Right side',
  flyoverLevel: 'Level 1',
  hazardSummary: 'Moderate traffic',
  affectedPersons: 2,
  status: 'VERIFYING',
  severity: 'MEDIUM',
  verificationStatus: 'VERIFIED',
  riskLevel: 'LOW',
  emergencyServiceStatus: 'Unit Assigned',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const validResponder: Responder = {
  id: 'rsp-001',
  name: 'Test Responder',
  status: 'Available',
  trainingValid: true,
  available: true,
  etaMinutes: 5,
  location: { lat: 12.9614, lng: 77.5844 },
  distanceKm: 1.8,
  directAccess: true,
  safeRoute: true,
  role: 'Medical Support',
  training: ['CPR'],
  score: 90,
  responseMode: 'Volunteer'
};

describe('safety gate', () => {
  it('blocks volunteer dispatch when scene is high-risk', () => {
    const incident = { ...baseIncident, severity: 'HIGH', hazardSummary: 'fire and fuel leakage' };
    const result = assessSceneRisk(incident);
    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.volunteerDispatchAllowed).toBe(false);
  });

  it('rejects responders with invalid training or unsafe route', () => {
    const invalidResponder = { ...validResponder, trainingValid: false };
    const unsafeResponder = { ...validResponder, safeRoute: false };

    expect(computeResponderSuitability(invalidResponder, baseIncident).eligible).toBe(false);
    expect(computeResponderSuitability(unsafeResponder, baseIncident).eligible).toBe(false);
  });

  it('ranks responders by suitability and accessibility', () => {
    const better = { ...validResponder, etaMinutes: 4, directAccess: true };
    const worse = { ...validResponder, id: 'rsp-002', etaMinutes: 9, directAccess: false };
    const ranked = rankResponders(baseIncident, [worse, better]);
    expect(ranked[0].responder.id).toBe('rsp-001');
  });
});
