import React, { useState } from 'react';
import pb from '../lib/pocketbase';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isScannerLogin = window.location.pathname === '/verify';
  const isResultsLogin = window.location.pathname === '/scratchlabs/audience-poll/results';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Auth uses username + password as credentials.
      const authData = await pb.collection('creds').authWithPassword(username, password);
      setLoading(false);
      onLogin(authData);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.message || 'Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#050805] text-[#ecffe0]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(200,255,0,0.14),transparent_38%),radial-gradient(circle_at_85%_10%,rgba(22,163,74,0.2),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(200,255,0,0.12),transparent_48%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(200,255,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,0,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-[#2a3720] bg-[#0c120c]/95 shadow-[0_0_0_1px_rgba(200,255,0,0.1),0_20px_65px_rgba(0,0,0,0.7)]"
        >
          <div className="border-b border-[#25311f] bg-gradient-to-r from-[#162310] via-[#131b11] to-[#0f180f] px-6 py-5">
            <span className="inline-flex items-center gap-2 border border-[#455839] bg-[#1f2d18] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c8ff00]">
              ScratchLabs Access
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.06em] text-[#ebffd2]">
              {isScannerLogin ? 'Scanner Login' : isResultsLogin ? 'Results Access' : 'Secure Access'}
            </h2>
            <p className="mt-2 text-xs tracking-[0.08em] text-[#95ab86] uppercase">
              Results Are Locked
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#96b082]" htmlFor="login-username">
                Username
              </label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full border border-[#31432a] bg-[#111911] px-4 py-3 text-[#ecffe0] placeholder:text-[#67805a] outline-none transition focus:border-[#c8ff00] focus:shadow-[0_0_0_2px_rgba(200,255,0,0.18)]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#96b082]" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-[#31432a] bg-[#111911] px-4 py-3 text-[#ecffe0] placeholder:text-[#67805a] outline-none transition focus:border-[#c8ff00] focus:shadow-[0_0_0_2px_rgba(200,255,0,0.18)]"
                required
              />
            </div>

            {error && (
              <div className="border border-[#6b1e1e] bg-[#271414] px-3 py-2 text-center text-sm font-semibold text-[#ff8d8d]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full border border-[#9ecf00] bg-[#c8ff00] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#142007] transition hover:bg-[#d8ff4d] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
