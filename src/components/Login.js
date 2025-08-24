import React, { useState } from 'react';
import pb from '../lib/pocketbase';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
  const authData = await pb.collection('creds').authWithPassword(username, password);
      setLoading(false);
      onLogin(authData);
    } catch (err) {
      setLoading(false);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#ede9fe] via-[#a78bfa] to-[#7c3aed]">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-violet-900 text-center mb-2">
          {window.location.pathname === '/verify' ? 'Scanner Login' : 'Dashboard Login'}
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="rounded-xl px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 placeholder:text-violet-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="rounded-xl px-4 py-3 border border-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-[#ede9fe] text-violet-900 placeholder:text-violet-400"
          required
        />
        {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="bg-[#7c3aed] text-white font-bold py-3 rounded-xl shadow hover:bg-[#a78bfa] transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
