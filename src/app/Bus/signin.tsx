import React, { useEffect, useState } from 'react';
import BusList from '../Bus/BusList';
import { getAuthHeaders } from '../Bus/lib/api';

type User = { email: string; role: string; name?: string; token?: string };

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const storedName = localStorage.getItem('name');
    if (t && email) setUser({ email, role: role || 'other', token: t, name: storedName || '' });
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.trim(), name: name.trim() })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', name || '');
      setUser({ email: data.email, role: data.role, token: data.token, name });
    } else {
      alert('Login failed');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setUser(null);
  }

  if (!user) {
    return (
      <div className="font-sans bg-[#2a2a2a] p-8 rounded-xl shadow-lg w-[350px] text-[#e0e0e0] mx-auto mt-16">
        <h1 className="text-center text-[#0078d4] text-2xl font-bold mb-6">Bus Sign-Up</h1>
        <form onSubmit={login}>
          <div className="mb-4">
            <label className="block mb-2 text-sm text-[#b0b0b0]">Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              required
              className="w-full p-2 border border-[#444] rounded-md bg-[#1e1e1e] text-[#e0e0e0] text-base focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4] focus:outline-none transition"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm text-[#b0b0b0]">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border border-[#444] rounded-md bg-[#1e1e1e] text-[#e0e0e0] text-base focus:border-[#0078d4] focus:ring-2 focus:ring-[#0078d4] focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#0078d4] text-white font-semibold rounded-md hover:bg-[#005fa3] active:scale-95 transition-transform"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#b0b0b0]">
          Use an email ending with{' '}
          <code className="text-[#80caff]">@s.thevillageschool.com</code> to sign up for buses
          (student).<br />
          Admin emails end with{' '}
          <code className="text-[#80caff]">@thevillageschool.com</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#2a2a2a] p-8 rounded-xl shadow-lg w-[600px] text-[#e0e0e0] mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-[#0078d4]">
          Welcome, {user.name || user.email} <span className="text-[#b0b0b0]">({user.role})</span>
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 active:scale-95 transition-transform"
        >
          Logout
        </button>
      </div>

      <BusList user={user} apiBase={process.env.NEXT_PUBLIC_API_BASE || ''} />
    </div>
  );
}