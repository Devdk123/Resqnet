import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement | null, options?: Record<string, unknown>) => void;
          prompt: (options?: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const ADMIN_CREDENTIALS: Record<string, string> = {
  shirsh: 'admin',
  arpit: 'admin',
  devesh: 'admin',
};

type AppUser = {
  username: string;
  role: 'admin' | 'volunteer';
};

type LoginPageProps = {
  user: AppUser | null;
  onLogin: (user: AppUser) => void;
};

type VolunteerEntry = {
  username: string;
  password: string;
};

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.5-5.4 3.5-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.6 2.9 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M3.9 7.4l3.5 2.6c.9-1.8 2.8-3 5.6-3 1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.6 2.9 14.6 2 12 2c-3.9 0-7.2 2.3-8.1 5.4z" opacity="0.9" />
      <path fill="#FBBC05" d="M3.5 12.1c0 1.9.9 3.6 2.3 4.7l3.5-2.9c-.5-.9-.8-1.9-.8-3.1 0-1.2.3-2.2.8-3.1L5.8 7.4C4.4 8.5 3.5 10.2 3.5 12.1z" opacity="0.9" />
      <path fill="#4285F4" d="M12 22c2.9 0 5.4-.9 7.2-2.6l-3.3-2.8c-.9.6-2.1 1-3.9 1-3.1 0-5.6-2.1-5.9-4.8l-3.3 2.8C.8 18.9 5.9 22 12 22z" opacity="0.9" />
    </svg>
  );
}

function getStoredVolunteers(): VolunteerEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem('resqnet-volunteers');
    return raw ? (JSON.parse(raw) as VolunteerEntry[]) : [];
  } catch {
    return [];
  }
}

export function LoginPage({ user, onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'admin' | 'volunteer'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current || !window.google?.accounts?.id) {
      return;
    }

    const handleCredentialResponse = (response: { credential?: string }) => {
      if (!response.credential) {
        setError('Google sign-in failed. Please try again.');
        return;
      }

      try {
        const payload = response.credential.split('.')[1];
        const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded)) as { name?: string; email?: string };
        const displayName = decoded.name || decoded.email || 'Google user';

        onLogin({ username: displayName, role: 'volunteer' });
        navigate('/responder');
      } catch {
        setError('Google profile could not be loaded.');
      }
    };

    const initializeGoogle = () => {
      window.google!.accounts!.id!.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google!.accounts!.id!.renderButton(googleButtonRef.current, {
        theme: 'filled_blue',
        size: 'large',
        width: '100%',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
      });
    };

    const scriptId = 'google-gsi-script';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [navigate, onLogin]);

  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/responder" replace />;
  }

  const handleAdminLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = username.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (ADMIN_CREDENTIALS[normalizedName] !== normalizedPassword || normalizedPassword !== 'admin') {
      setError('Invalid admin credentials.');
      return;
    }

    onLogin({ username: normalizedName, role: 'admin' });
    navigate('/admin-dashboard');
  };

  const handleVolunteerLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = username.trim();
    const normalizedPassword = password.trim();
    const volunteers = getStoredVolunteers();

    const match = volunteers.find(
      (volunteer) => volunteer.username.toLowerCase() === normalizedName.toLowerCase() && volunteer.password === normalizedPassword,
    );

    if (!match) {
      setError('Volunteer login failed. Please register first or use a saved valid username and password.');
      return;
    }

    onLogin({ username: match.username, role: 'volunteer' });
    navigate('/responder');
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-130px)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-emerald-200/15 bg-[#0f1d18]/80 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden border-r border-emerald-200/10 bg-gradient-to-br from-[#10281f] via-[#16362d] to-[#1a120d] p-8 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(69,173,123,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_30%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-100">
              RESQNET
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-stone-50">Secure access</h1>
          </div>

          <div className="relative z-10 rounded-2xl border border-emerald-200/10 bg-[#12231d]/60 p-4 text-sm text-stone-200/80">
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-emerald-200">Access tiers</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span>Admin</span>
                <span className="text-emerald-300">Command</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                <span>Volunteer</span>
                <span className="text-emerald-300">Field</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-200/90">SIGN IN</div>
                <h2 className="mt-2 text-3xl font-semibold text-white">Welcome</h2>
              </div>
              <Link to="/" className="rounded-full border border-emerald-200/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-100 transition hover:bg-emerald-500/20">
                Home
              </Link>
            </div>

            <div className="mb-6 flex justify-center">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div ref={googleButtonRef} className="w-full max-w-xs" aria-label="Continue with Google" />
              ) : (
                <button
                  type="button"
                  aria-label="Continue with Google"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/25 bg-white/5 opacity-70 transition hover:scale-[1.02] hover:bg-white/10"
                  onClick={() => setError('Add VITE_GOOGLE_CLIENT_ID to enable Google login.')}
                >
                  <GoogleLogo />
                </button>
              )}
            </div>

            <p className="mb-6 text-center text-xs text-stone-300/80">
              By continuing, you agree to our{' '}
              <Link to="/privacy-policy" className="text-emerald-300 underline-offset-2 hover:underline">Privacy Policy</Link>{' '}
              and{' '}
              <Link to="/cookies" className="text-emerald-300 underline-offset-2 hover:underline">Cookies Policy</Link>.
            </p>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-emerald-200/10 bg-[#11261f]/70 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('admin');
                  setError('');
                }}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  mode === 'admin' ? 'bg-emerald-500 text-white' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('volunteer');
                  setError('');
                }}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  mode === 'volunteer' ? 'bg-emerald-500 text-white' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                Volunteer
              </button>
            </div>

            {mode === 'admin' ? (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label htmlFor="username" className="mb-2 block text-sm font-medium text-stone-200">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter admin username"
                    className="w-full rounded-2xl border border-emerald-200/15 bg-[#11261f]/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-300/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-200">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-2xl border border-emerald-200/15 bg-[#11261f]/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-300/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                {error ? (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110"
                >
                  Admin Sign in
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <form onSubmit={handleVolunteerLogin} className="space-y-5">
                  <div>
                    <label htmlFor="volunteer-name" className="mb-2 block text-sm font-medium text-stone-200">Volunteer Username</label>
                    <input
                      id="volunteer-name"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Enter volunteer username"
                      className="w-full rounded-2xl border border-emerald-200/15 bg-[#11261f]/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-300/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="volunteer-password" className="mb-2 block text-sm font-medium text-stone-200">Password</label>
                    <input
                      id="volunteer-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter volunteer password"
                      className="w-full rounded-2xl border border-emerald-200/15 bg-[#11261f]/80 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-300/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition hover:brightness-110"
                  >
                    Volunteer Sign in
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    const stored = getStoredVolunteers();
                    const normalizedName = username.trim();
                    const normalizedPassword = password.trim();

                    if (!normalizedName || !normalizedPassword) {
                      setError('Enter a username and password to register as a volunteer.');
                      return;
                    }

                    const exists = stored.some((entry) => entry.username.toLowerCase() === normalizedName.toLowerCase());
                    if (exists) {
                      setError('Volunteer username already exists.');
                      return;
                    }

                    const updated = [...stored, { username: normalizedName, password: normalizedPassword }];
                    window.localStorage.setItem('resqnet-volunteers', JSON.stringify(updated));
                    onLogin({ username: normalizedName, role: 'volunteer' });
                    navigate('/responder');
                  }}
                  className="w-full rounded-2xl border border-emerald-200/15 bg-[#17352d] px-4 py-3 text-base font-semibold text-emerald-100 transition hover:bg-[#214236]"
                >
                  Register as Volunteer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
