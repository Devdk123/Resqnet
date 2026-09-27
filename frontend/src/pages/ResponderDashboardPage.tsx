import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, MapPinned, Navigation, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function ResponderDashboardPage() {
  const [accepted, setAccepted] = useState(false);

  return (
    <main className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium text-white">Responder Status</div>
          <StatusBadge tone="success">Available</StatusBadge>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-red-300"><AlertTriangle size={16} /> <span className="text-xs uppercase tracking-[0.2em]">New Emergency</span></div>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between"><span>Location</span><span className="text-white">Greenfield Flyover</span></div>
            <div className="flex items-center justify-between"><span>ETA</span><span className="text-white">5 min</span></div>
            <div className="flex items-center justify-between"><span>Category</span><span className="text-white">Vehicle Collision</span></div>
            <div className="flex items-center justify-between"><span>Scene Risk</span><span className="text-white">MODERATE</span></div>
            <div className="flex items-center justify-between"><span>Emergency service</span><span className="text-white">Unit En Route</span></div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => setAccepted(true)} className="rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950">ACCEPT</button>
          <button className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-white">DECLINE</button>
        </div>

        {accepted && (
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-sky-300">Status Timeline</div>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-300" /> Accepted</div>
              <div className="flex items-center gap-2"><Clock3 size={14} className="text-sky-300" /> En Route</div>
              <div className="flex items-center gap-2"><Navigation size={14} className="text-sky-300" /> Arrived</div>
              <div className="flex items-center gap-2"><MapPinned size={14} className="text-amber-300" /> Handover</div>
              <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-red-300" /> Closed</div>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          <strong>Do not enter unsafe scenes. Follow safety instructions.</strong>
        </div>
      </div>
    </main>
  );
}
