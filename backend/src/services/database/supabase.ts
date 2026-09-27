import { createClient } from '@supabase/supabase-js';
import { env } from '../../config/env.js';
import type { Incident } from '../../types/index.js';

const supabase = env.supabaseUrl && env.supabaseSecretKey
  ? createClient(env.supabaseUrl, env.supabaseSecretKey)
  : null;

type IncidentRow = {
  external_id: string;
  type: Incident['type'];
  status: Incident['status'];
  severity: string;
  risk_level: Incident['riskLevel'];
  details: Incident;
};

export const isSupabaseConfigured = supabase !== null;

export async function loadIncidents(): Promise<Incident[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('incidents')
    .select('external_id, type, status, severity, risk_level, details')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to load incidents from Supabase: ${error.message}`);

  return (data as IncidentRow[]).map((row) => ({
    ...row.details,
    id: row.external_id,
    type: row.type,
    status: row.status,
    severity: row.severity,
    riskLevel: row.risk_level
  }));
}

export async function saveIncident(incident: Incident): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from('incidents').upsert({
    external_id: incident.id,
    type: incident.type,
    status: incident.status,
    severity: incident.severity,
    risk_level: incident.riskLevel,
    location: {
      type: 'Point',
      coordinates: [incident.location.lng, incident.location.lat]
    },
    created_at: incident.createdAt,
    updated_at: incident.updatedAt,
    details: incident
  }, { onConflict: 'external_id' });

  if (error) throw new Error(`Failed to save incident to Supabase: ${error.message}`);
}