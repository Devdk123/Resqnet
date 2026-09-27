import { useMemo } from 'react';
import { Activity, ShieldAlert, Users, Gauge, Siren, Workflow } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

export function CommandCenterPage() {
  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => apiFetch<any[]>('/api/incidents')
  });

  const { data: analytics = {} } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => apiFetch<any>('/api/analytics')
  });

  const selectedIncident = incidents[0];
  const kpis = useMemo(() => [
    { label: 'Active Incidents', value: `${incidents.length || 5}`, icon: Activity },
    { label: 'Critical Incidents', value: '2', icon: Siren },
    { label: 'Available Responders', value: '18', icon: Users },
    { label: 'Responders En Route', value: '4', icon: Workflow },
    { label: 'Average Response ETA', value: '6.2 min', icon: Gauge },
    { label: 'Verification Rate', value: '93%', icon: ShieldAlert }
  ], [incidents]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-sky-300">Command Center</div>
          <h1 className="mt-2 text-3xl font-semibold text-white">Operational Overview</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-emerald-300">ARES STATUS: ACTIVE</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
              <Icon size={14} className="text-sky-300" />
            </div>
            <div className="mt-4 text-2xl font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.6fr_0.9fr]">
        <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Incidents</div>
            <StatusBadge tone="info">Live</StatusBadge>
          </div>
          <div className="space-y-3">
            {incidents.map((incident: any) => (
              <button key={incident.id} className="w-full rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-left hover:border-sky-500/40">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{incident.id}</div>
                  <StatusBadge tone={incident.riskLevel === 'CRITICAL' ? 'danger' : incident.riskLevel === 'HIGH' ? 'warning' : 'success'}>{incident.riskLevel}</StatusBadge>
                </div>
                <div className="mt-2 text-sm text-slate-300">{incident.type}</div>
                <div className="mt-2 text-xs text-slate-400">{incident.location?.lat}, {incident.location?.lng}</div>
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Live Map</div>
            <StatusBadge tone="warning">High risk</StatusBadge>
          </div>
          <div className="map-panel relative h-[520px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
            <div className="absolute left-8 top-12 h-4 w-4 rounded-full bg-red-500 shadow-[0_0_28px_rgba(239,68,68,0.8)]" />
            <div className="absolute right-20 top-20 h-4 w-4 rounded-full bg-emerald-500 shadow-[0_0_28px_rgba(16,185,129,0.8)]" />
            <div className="absolute left-1/2 top-1/3 h-4 w-4 -translate-x-1/2 rounded-full bg-sky-500 shadow-[0_0_28px_rgba(59,130,246,0.8)]" />
            <div className="absolute bottom-12 left-20 h-4 w-4 rounded-full bg-amber-500" />
            <div className="absolute bottom-16 right-16 h-4 w-4 rounded-full bg-violet-500" />
            <div className="absolute inset-x-12 top-1/2 h-px -translate-y-1/2 bg-sky-500/40" />
            <div className="absolute inset-y-12 left-1/2 w-px -translate-x-1/2 bg-sky-500/40" />
            <div className="absolute left-8 top-8 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">Incident {selectedIncident?.id || 'INC-1001'}</div>
            <div className="absolute bottom-8 left-8 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200">Safe perimeter</div>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">AI Ops</div>
            <StatusBadge tone="success">ARES</StatusBadge>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">AI Recommendation</div>
              <p className="mt-2 text-sm text-slate-200">Responder B selected because ETA is 5 min, direct road access is available, training is valid, and responder is available.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Reason Summary</div>
              <p className="mt-2 text-sm text-slate-200">High scene risk due to active traffic and uncertain road-side accessibility.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Human Override</div>
              <p className="mt-2 text-sm text-slate-200">Operator can override this recommendation at any time before dispatch confirmation.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Agent Activity Timeline</div>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>✓ Incident loaded</li>
                <li>✓ Emergency escalation initiated</li>
                <li>✓ Scene risk assessed</li>
                <li>✓ 8 responders evaluated</li>
                <li>✓ Wave 1 dispatched</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
