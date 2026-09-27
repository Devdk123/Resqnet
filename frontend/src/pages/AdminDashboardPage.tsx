import { Activity, BellRing, ShieldCheck, Users, Zap } from 'lucide-react';

const stats = [
  { label: 'Live incidents', value: '24', detail: '+4 vs last hour', icon: Activity },
  { label: 'Active responders', value: '186', detail: '92 on duty', icon: Users },
  { label: 'Verified alerts', value: '96%', detail: 'System confidence', icon: ShieldCheck },
  { label: 'Dispatch efficiency', value: '8.4 min', detail: 'Faster than target', icon: Zap },
];

export function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-emerald-300">Super Admin</div>
          <h1 className="mt-2 text-3xl font-semibold text-white">Operations Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
          <BellRing size={12} />
          System online
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-emerald-800/40 bg-[#11261f]/80 p-4 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.22em] text-stone-300">{label}</span>
              <Icon size={16} className="text-emerald-300" />
            </div>
            <div className="mt-5 text-3xl font-semibold text-white">{value}</div>
            <div className="mt-2 text-sm text-stone-300">{detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-emerald-800/40 bg-[#11261f]/80 p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.24em] text-stone-300">Dispatch overview</div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-900/60 bg-[#0e1d1a]/80 p-4">
              <div className="flex items-center justify-between text-sm text-stone-200">
                <span>Critical response pool</span>
                <span className="text-emerald-300">12/14</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-emerald-900/80">
                <div className="h-2 w-[86%] rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-900/60 bg-[#0e1d1a]/80 p-4">
              <div className="flex items-center justify-between text-sm text-stone-200">
                <span>Volunteer readiness</span>
                <span className="text-emerald-300">74%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-emerald-900/80">
                <div className="h-2 w-[74%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-900/60 bg-[#0e1d1a]/80 p-4">
              <div className="flex items-center justify-between text-sm text-stone-200">
                <span>Case verification</span>
                <span className="text-emerald-300">96%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-emerald-900/80">
                <div className="h-2 w-[96%] rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-emerald-800/40 bg-[#11261f]/80 p-5">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-300">Priority actions</div>
            <ul className="space-y-3 text-sm text-stone-200">
              <li className="rounded-2xl bg-[#0d1d1a] p-3">Approve 3 new volunteer registrations</li>
              <li className="rounded-2xl bg-[#0d1d1a] p-3">Review 2 high-risk road dispatches</li>
              <li className="rounded-2xl bg-[#0d1d1a] p-3">Audit route safety decisions</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-emerald-800/40 bg-[#11261f]/80 p-5">
            <div className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-300">Quick access</div>
            <div className="space-y-3 text-sm text-stone-200">
              <button type="button" className="w-full rounded-2xl border border-emerald-700/30 bg-emerald-500/10 px-3 py-2 text-left text-emerald-100">Command Center</button>
              <button type="button" className="w-full rounded-2xl border border-emerald-700/30 bg-emerald-500/10 px-3 py-2 text-left text-emerald-100">Responder Directory</button>
              <button type="button" className="w-full rounded-2xl border border-emerald-700/30 bg-emerald-500/10 px-3 py-2 text-left text-emerald-100">Safety Audit</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
