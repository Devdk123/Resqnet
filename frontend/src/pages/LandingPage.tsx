import { useEffect } from 'react';
import { ArrowRight, ShieldCheck, Activity, MapPinned, Cpu, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const revealText = (text: string) =>
  text.split(' ').map((word, index) => (
    <span key={`${word}-${index}`} className="reveal-word" style={{ transitionDelay: `${index * 30}ms` }}>
      {word}
    </span>
  ));

const metrics = [
  { label: 'Live incidents', value: '128' },
  { label: 'Response ETA', value: '5.8 min' },
  { label: 'Risk-aware matches', value: '92%' },
  { label: 'Safety gate blocks', value: '17' }
];

const indiaLocations = [
  'Delhi',
  'Lucknow',
  'Ayodhya',
  'Kanpur',
  'Agra',
  'Varanasi',
  'Prayagraj',
  'Jaipur',
  'Patna',
  'Gorakhpur',
  'Mumbai',
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Ranchi',
  'Guwahati',
  'Bhopal',
  'Indore'
];

const upHighPriorityCities = [
  { name: 'Lucknow', left: '35%', top: '28%' },
  { name: 'Ayodhya', left: '50%', top: '36%' },
  { name: 'Kanpur', left: '30%', top: '42%' },
  { name: 'Varanasi', left: '54%', top: '44%' },
  { name: 'Prayagraj', left: '44%', top: '52%' },
  { name: 'Gorakhpur', left: '58%', top: '26%' },
  { name: 'Agra', left: '24%', top: '50%' },
  { name: 'Aligarh', left: '19%', top: '40%' },
  { name: 'Meerut', left: '12%', top: '30%' },
  { name: 'Ghaziabad', left: '15%', top: '24%' },
  { name: 'Bareilly', left: '28%', top: '18%' },
  { name: 'Jhansi', left: '36%', top: '58%' },
  { name: 'Noida', left: '18%', top: '22%' },
  { name: 'Saharanpur', left: '8%', top: '18%' }
];

export function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-grid scroll-reveal relative overflow-hidden rounded-[30px] border border-emerald-300/10 p-6 md:p-10" style={{ background: 'linear-gradient(135deg, rgba(20, 59, 42, 0.92), rgba(53, 34, 22, 0.86))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(69,173,123,0.18),transparent_35%),radial-gradient(circle_at_right,_rgba(16,185,129,0.10),transparent_28%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-emerald-200/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-100 reveal-inline">Agentic emergency coordination</div>
            <h1 className="reveal-heading max-w-[10.5ch] text-[2.2rem] font-bold leading-[0.88] tracking-[-0.06em] text-stone-50 sm:max-w-[12ch] sm:text-[3rem] md:max-w-xl md:text-6xl md:leading-[0.95]" style={{ letterSpacing: '-0.07em', wordSpacing: '0.1em' }}>{revealText('When every minute matters, coordinate the right responder.')}</h1>
            <p className="reveal-copy mt-4 max-w-xl text-[0.88rem] leading-6 text-stone-200/90 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">An agentic emergency coordination network that connects verified responders with emergency operations using risk, accessibility, availability and ETA.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/command-center" className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/20 bg-[#12251d]/80 px-5 py-3 font-semibold text-stone-100 transition hover:border-emerald-200/50 hover:text-emerald-100">Open Command Center</Link>
              <Link to="/responder" className="cta-button wood-button inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-stone-50 transition hover:brightness-110">Become a Responder</Link>
            </div>
          </div>

          <div className="relative">
            <div className="hero-card-float bamboo-hero skew-surface rounded-[28px] border border-emerald-200/20 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
              <div className="rounded-[22px] border border-stone-200/15 bg-[#10241f]/80 p-4 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-200/80"><Activity size={14} className="text-emerald-300" /> ARES Status</div>
                  <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-100">Active</span>
                </div>
                <div className="map-panel relative h-80 overflow-hidden rounded-2xl border border-stone-200/10 bg-[#0d1f1a]/60">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80" alt="Hospital campus" className="h-full w-full object-cover opacity-50" />
                  <div className="absolute left-8 top-10 h-3 w-3 rounded-full bg-red-400 shadow-[0_0_20px_rgba(217,74,63,0.8)]" />
                  <div className="absolute left-20 top-20 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(69,173,123,0.8)]" />
                  <div className="absolute right-16 top-16 h-3 w-3 rounded-full bg-amber-300" />
                  <div className="absolute bottom-12 left-12 h-3 w-3 rounded-full bg-red-400" />
                  <div className="absolute bottom-20 right-20 h-3 w-3 rounded-full bg-violet-300" />
                  <div className="absolute inset-x-12 top-1/2 h-[1px] -translate-y-1/2 bg-emerald-200/40" />
                  <div className="absolute inset-y-8 left-1/2 w-[1px] -translate-x-1/2 bg-emerald-200/40" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-100/20 bg-black/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-100">Network Coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card scroll-reveal rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{metric.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Safety Architecture', text: 'Deterministic safety gate blocks unsafe volunteer dispatch and prioritizes emergency service escalation.' },
            { icon: Cpu, title: 'AI Coordination', text: 'ARES evaluates scene risk, route quality, training validity, and responder suitability with human override.' },
            { icon: MapPinned, title: 'Route Aware', text: 'Access constraints, flyover side, and ETA are evaluated before dispatch.' }
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="scroll-reveal rounded-2xl border border-stone-200/10 bg-[#1a120d]/70 p-6 backdrop-blur-sm">
              <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-200"><Icon size={20} /></div>
              <h3 className="text-xl font-semibold text-stone-50">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-200/80">{text}</p>
            </div>
          ))}
        </div>

        <aside className="ops-panel scroll-reveal side-panel rounded-[26px] p-5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-100">Ops Rail</div>
            <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-emerald-100">Live</span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="status-rail rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-200/75">
                <span>Scene Risk</span>
                <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-1 text-[9px] text-red-200">HIGH</span>
              </div>
            </div>
            <div className="status-rail rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-200/75">
                <span>EMS</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-100">EN ROUTE</span>
              </div>
            </div>
            <div className="status-rail rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-200/75">
                <span>Dispatch</span>
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-1 text-[9px] text-amber-100">WAVE 2</span>
              </div>
            </div>
            <div className="status-rail rounded-2xl p-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-stone-200/75">
                <span>Safety Gate</span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-100">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="scroll-reveal mt-20 rounded-3xl border border-emerald-200/10 bg-[#11261f]/70 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/10 bg-[#0d1d1a]/80 p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">Helped</div>
            <div className="mt-4 space-y-4 text-stone-100">
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <span>Critical cases routed</span>
                <span className="font-semibold text-emerald-300">148</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <span>Volunteer matches</span>
                <span className="font-semibold text-emerald-300">92%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                <span>Avg. response time</span>
                <span className="font-semibold text-emerald-300">5.8 min</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-300/10 bg-[#1a120d]/80 p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-amber-200">Pending</div>
            <div className="mt-4 space-y-4 text-stone-100">
              <div className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-2">
                <span>High-risk dispatch review</span>
                <span className="font-semibold text-amber-300">7</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-2">
                <span>Volunteer approvals</span>
                <span className="font-semibold text-amber-300">12</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-500/5 px-3 py-2">
                <span>Route audit queue</span>
                <span className="font-semibold text-amber-300">4</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-reveal mt-12 rounded-[30px] border border-emerald-200/10 bg-[#0f1d18]/75 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-200">India network</div>
            <h2 className="mt-2 text-3xl font-semibold text-white">Coverage across key Indian locations</h2>
          </div>
          <div className="rounded-full border border-emerald-200/20 bg-emerald-500/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-emerald-100">
            UP • Delhi • India
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="google-map-panel relative overflow-hidden rounded-[28px] border border-emerald-200/10 bg-[#0d1f1a]/80 p-3">
            <iframe
              title="India map"
              src="https://maps.google.com/maps?q=Lucknow,Ayodhya,Varanasi,Delhi,India&z=6&output=embed"
              className="h-[420px] w-full rounded-2xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-300/50 bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-100">Delhi</span>
              <span className="rounded-full border border-red-300/70 bg-red-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100">Lucknow</span>
              <span className="rounded-full border border-red-300/70 bg-red-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100">Ayodhya</span>
              <span className="rounded-full border border-red-300/70 bg-red-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100">Varanasi</span>
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-200/10 bg-[#10261f]/80 p-5">
            <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-emerald-200">Active locations</div>
            <div className="flex flex-wrap gap-2">
              {indiaLocations.map((location) => (
                <span
                  key={location}
                  className="rounded-full border border-emerald-200/15 bg-emerald-500/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-stone-100"
                >
                  {location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
