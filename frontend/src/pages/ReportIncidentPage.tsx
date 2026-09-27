import { useState } from 'react';
import { AlertTriangle, MapPin, Send } from 'lucide-react';
import { apiFetch } from '../lib/api';

export function ReportIncidentPage() {
  const [form, setForm] = useState({
    type: 'Road Accident',
    landmark: 'Near Metro station',
    roadName: 'Outer Ring Road',
    roadSide: 'Right side',
    flyoverLevel: 'Level 2',
    hazardSummary: 'Heavy traffic',
    affectedPersons: 2,
    notes: 'A vehicle is partially blocking the lane.'
  });
  const [submitted, setSubmitted] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<any>('/api/incidents', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          title: 'Incident report',
          description: 'Emergency response required',
          location: { lat: 12.9614, lng: 77.5844 },
          severity: 'MEDIUM'
        })
      });
      setSubmitted(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3 text-sky-300">
        <AlertTriangle className="text-amber-300" />
        <span className="text-xs uppercase tracking-[0.3em]">Emergency service escalation will not wait for responder selection.</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h1 className="text-3xl font-semibold text-white">Report Emergency</h1>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              Incident Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white">
                {['Road Accident', 'Vehicle Collision', 'Fire', 'Medical Emergency', 'Other'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <div className="mt-6 flex items-end md:mt-0">
              <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-3 text-sm font-medium text-sky-200"><MapPin size={16} /> Use My Location</button>
            </div>

            <label className="text-sm text-slate-300">
              Landmark
              <input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300">
              Road Name
              <input value={form.roadName} onChange={(e) => setForm({ ...form, roadName: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300">
              Road Side
              <input value={form.roadSide} onChange={(e) => setForm({ ...form, roadSide: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300">
              Flyover Level
              <input value={form.flyoverLevel} onChange={(e) => setForm({ ...form, flyoverLevel: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300 md:col-span-2">
              Visible hazards
              <input value={form.hazardSummary} onChange={(e) => setForm({ ...form, hazardSummary: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300">
              Approx. affected persons
              <input type="number" value={form.affectedPersons} onChange={(e) => setForm({ ...form, affectedPersons: Number(e.target.value) })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
            <label className="text-sm text-slate-300">
              Optional notes
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white" />
            </label>
          </div>

          <button type="submit" disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:opacity-70">
            <Send size={18} /> {loading ? 'Submitting...' : 'REPORT INCIDENT'}
          </button>
        </form>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="mb-4 text-xs uppercase tracking-[0.28em] text-slate-400">Submission status</div>
          {submitted ? (
            <div className="space-y-4 text-sm text-slate-200">
              <div><span className="text-slate-400">Incident ID:</span> <span className="font-semibold text-white">{submitted.incident?.id}</span></div>
              <div><span className="text-slate-400">Status:</span> <span className="font-semibold text-amber-300">{submitted.incident?.status}</span></div>
              <div><span className="text-slate-400">Emergency escalation:</span> <span className="font-semibold text-emerald-300">{submitted.emergencyService?.status}</span></div>
              <div><span className="text-slate-400">Responder coordination:</span> <span className="font-semibold text-sky-300">{submitted.responderCoordination?.status}</span></div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
              No incident reported yet. Submit to trigger emergency-service escalation and ARES ranking.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
