import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { LayoutDashboard, Menu, Moon, ShieldCheck, Sun } from 'lucide-react';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { ResponderDashboardPage } from './pages/ResponderDashboardPage';

type AppUser = {
  username: string;
  role: 'admin' | 'volunteer';
};

type ThemeMode = 'night' | 'light';

function AppShell({
  user,
  onLogin,
  onLogout,
}: {
  user: AppUser | null;
  onLogin: (user: AppUser) => void;
  onLogout: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('night');
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSidebarOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (sidebarRef.current && target && !sidebarRef.current.contains(target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isSidebarOpen]);

  const isLight = themeMode === 'light';
  const shellClasses = isLight ? 'bg-[#f5f2ec] text-slate-800' : 'bg-transparent text-slate-100';
  const headerClasses = isLight
    ? 'border-[#d9d1c7] bg-[#f2efe9]/90 text-slate-800'
    : 'border-emerald-200/10 bg-[#1f2d26]/80 text-slate-100';
  const navTextClasses = isLight ? 'text-slate-700 hover:text-emerald-700' : 'text-stone-100/90 hover:text-emerald-200';
  const actionClasses = isLight
    ? 'border border-slate-300 bg-[#ffffff] text-slate-800 hover:bg-slate-100'
    : 'border border-emerald-200/20 bg-[#11261f]/70 text-emerald-50 hover:bg-[#17352d]';
  const appBackgroundStyle = {
    backgroundImage: "url('/src/HD Bamboo Backgrounds.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  } as const;

  return (
    <div className={`app-shell-screen min-h-screen ${shellClasses}`} style={appBackgroundStyle}>
      <header
        className={`sticky top-0 z-50 border-b ${headerClasses}`}
        style={{ backgroundImage: "url('/src/HD Bamboo Backgrounds.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium ${actionClasses}`}
              aria-label="Open side panel"
            >
              <Menu size={18} />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg font-bold shadow-lg ${isLight ? 'border-emerald-700/30 bg-emerald-500/10 text-emerald-700 shadow-emerald-900/10' : 'border-emerald-200/30 bg-emerald-500/10 text-emerald-100 shadow-emerald-950/30'}`}>
                R
              </div>
              <div>
                <div className={`text-lg font-semibold tracking-[0.2em] ${isLight ? 'text-emerald-800' : 'text-emerald-50'}`}>RESQNET</div>
                <div className={`text-[10px] uppercase tracking-[0.24em] ${isLight ? 'text-slate-600' : 'text-stone-200/80'}`}>Emergency Coordination</div>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link to="/" className={`transition ${navTextClasses}`}>Home</Link>
            <Link to="/report" className={`transition ${navTextClasses}`}>Report</Link>
            <Link to="/command-center" className={`transition ${navTextClasses}`}>Command</Link>
            <Link to="/responder" className={`transition ${navTextClasses}`}>Responders</Link>
            {user?.role === 'admin' ? (
              <Link to="/admin-dashboard" className={`transition ${navTextClasses}`}>
                Admin
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/report"
              className="inline-flex rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(239,68,68,0.35)] transition hover:brightness-110 sm:px-4 sm:py-2 sm:text-sm"
            >
              Report Emergency
            </Link>

            {user ? (
              <>
                <span className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex ${isLight ? 'border-emerald-700/20 bg-emerald-500/10 text-emerald-700' : 'border-emerald-200/20 bg-emerald-500/10 text-emerald-100'}`}>
                  {user.username}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${actionClasses}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`hidden rounded-xl px-4 py-2 text-sm font-medium transition sm:inline-flex ${actionClasses}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-2 sm:px-6 lg:px-8">
        <Link
          to="/report"
          className="block w-full rounded-[18px] bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-5 py-4 text-center text-base font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition hover:brightness-110 sm:text-lg"
        >
          Report Emergency
        </Link>
      </div>

      {isSidebarOpen ? (
        <aside
          ref={sidebarRef}
          className={`app-shell-panel fixed left-3 top-16 z-50 w-[230px] rounded-2xl border shadow-2xl sm:w-[250px] lg:w-[270px] ${isLight ? 'border-slate-200 text-slate-800 shadow-slate-300/40' : 'border-emerald-200/10 text-slate-100 shadow-black/40'}`}
          style={{
            backgroundImage: "url('/src/HD Bamboo Backgrounds.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl border text-sm font-bold ${isLight ? 'border-emerald-700/30 bg-emerald-500/10 text-emerald-700' : 'border-emerald-200/30 bg-emerald-500/10 text-emerald-100'}`}>
                R
              </div>
              <div className="text-left" />
            </div>
            <button type="button" onClick={() => setIsSidebarOpen(false)} className={`text-xl leading-none ${isLight ? 'text-slate-700' : 'text-stone-300'}`}>×</button>
          </div>

          <div className="space-y-3 p-3">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'}`}
              >
                <ShieldCheck size={15} className="text-emerald-400" /> Home
              </Link>
              <Link
                to="/report"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'}`}
              >
                <ShieldCheck size={15} className="text-emerald-400" /> Report
              </Link>
              <Link to="/command-center" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'}`}>
                <ShieldCheck size={15} className="text-emerald-400" /> Command Center
              </Link>
              <Link to="/responder" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'}`}>
                <LayoutDashboard size={15} className="text-emerald-400" /> Responders
              </Link>
              {user?.role === 'admin' ? (
                <Link to="/admin-dashboard" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${isLight ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200' : 'border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'}`}>
                  <LayoutDashboard size={15} className="text-emerald-400" /> Super Admin Dashboard
                </Link>
              ) : null}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium ${isLight ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100' : 'border-emerald-200/20 bg-[#11261f]/70 text-emerald-50 hover:bg-[#17352d]'}`}
                >
                  Login
                </Link>
              ) : null}
            </div>

            <div className={`mt-2 rounded-2xl border p-3 ${isLight ? 'border-emerald-200 bg-emerald-50' : 'border-emerald-500/20 bg-emerald-500/10'}`}>
              <div className={`mb-3 text-[10px] uppercase tracking-[0.28em] ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>Theme</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('night')}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition ${themeMode === 'night' ? (isLight ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white') : isLight ? 'bg-white text-slate-700' : 'bg-white/5 text-stone-300'}`}
                >
                  <Moon size={14} /> Night
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm transition ${themeMode === 'light' ? 'bg-emerald-500 text-white' : isLight ? 'bg-white text-slate-700' : 'bg-white/5 text-stone-300'}`}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>
          </div>
        </aside>
      ) : null}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage user={user} onLogin={onLogin} />} />
        <Route path="/report" element={<ReportIncidentPage />} />
        <Route path="/command-center" element={<CommandCenterPage />} />
        <Route path="/responder" element={<ResponderDashboardPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookies" element={<PrivacyPolicyPage />} />
      </Routes>

      <footer className="mt-10 border-t border-stone-200/10 bg-[#1a120d]/80" style={{ backgroundImage: "url('/src/HD Bamboo Backgrounds.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <div className={`text-xs uppercase tracking-[0.26em] ${isLight ? 'text-emerald-700' : 'text-emerald-100'}`}>RESQNET</div>
            <p className={`mt-3 max-w-sm text-sm ${isLight ? 'text-slate-600' : 'text-stone-200/80'}`}>Human-first emergency response coordination with risk-aware routing, controlled dispatch, and rapid escalation for emergency services.</p>
          </div>
          <div>
            <div className={`text-xs uppercase tracking-[0.26em] ${isLight ? 'text-emerald-700' : 'text-emerald-100'}`}>Command Layers</div>
            <ul className={`mt-3 space-y-2 text-sm ${isLight ? 'text-slate-600' : 'text-stone-200/80'}`}>
              <li>Emergency service priority</li>
              <li>Responder suitability ranking</li>
              <li>AI-assisted operations</li>
            </ul>
          </div>
          <div>
            <div className={`text-xs uppercase tracking-[0.26em] ${isLight ? 'text-emerald-700' : 'text-emerald-100'}`}>Hospital Ops</div>
            <ul className={`mt-3 space-y-2 text-sm ${isLight ? 'text-slate-600' : 'text-stone-200/80'}`}>
              <li>Risk gate active</li>
              <li>Safe route validation</li>
              <li>Live coordination status</li>
            </ul>
          </div>
          <div>
            <div className={`text-xs uppercase tracking-[0.26em] ${isLight ? 'text-emerald-700' : 'text-emerald-100'}`}>Legal</div>
            <ul className={`mt-3 space-y-2 text-sm ${isLight ? 'text-slate-600' : 'text-stone-200/80'}`}>
              <li><Link to="/privacy-policy" className="hover:text-emerald-300">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-emerald-300">Cookies Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<AppUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = window.localStorage.getItem('resqnet-user');
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AppUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('resqnet-user', JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem('resqnet-user');
  }, [user]);

  return <AppShell user={user} onLogin={setUser} onLogout={() => setUser(null)} />;
}
