export type IncidentType =
  | 'Road Accident'
  | 'Vehicle Collision'
  | 'Fire'
  | 'Medical Emergency'
  | 'Other';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'EMERGENCY_ESCALATED'
  | 'ASSESSING'
  | 'DISPATCHING'
  | 'RESPONDER_ASSIGNED'
  | 'RESPONDER_EN_ROUTE'
  | 'HANDOVER_PENDING'
  | 'RESOLVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'FAILED'
  | 'DEGRADED_MODE';

export type DispatchStatus =
  | 'CREATED'
  | 'NOTIFIED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'EN_ROUTE'
  | 'ARRIVED'
  | 'HANDOVER'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  location: Coordinates;
  landmark: string;
  roadName: string;
  roadSide: string;
  flyoverLevel: string;
  hazardSummary: string;
  affectedPersons: number;
  notes?: string;
  status: IncidentStatus;
  severity: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  riskLevel: RiskLevel;
  weather?: {
    temperature: number;
    rain: number;
    visibility: number;
    wind: number;
    condition: string;
  };
  emergencyServiceStatus: string;
  createdAt: string;
  updatedAt: string;
  timeline?: Array<{ time: string; event: string }>; 
}

export interface Responder {
  id: string;
  name: string;
  status: 'Available' | 'Unavailable' | 'En Route' | 'On Scene';
  trainingValid: boolean;
  available: boolean;
  etaMinutes: number;
  location: Coordinates;
  distanceKm: number;
  directAccess: boolean;
  safeRoute: boolean;
  role: string;
  training: string[];
  score: number;
  responseMode: 'Volunteer' | 'Professional';
}

export interface NotificationRecord {
  id: string;
  responderId: string;
  incidentId: string;
  wave: number;
  status: 'sent' | 'delivered' | 'accepted' | 'declined' | 'failed' | 'expired';
  createdAt: string;
}

export interface AgentRun {
  id: string;
  incidentId?: string;
  prompt: string;
  status: 'running' | 'completed' | 'failed';
  output: Record<string, unknown>;
  timeline: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
  requestId: string;
}
