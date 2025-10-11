import React, { useEffect, useState } from 'react';
import { getAuthHeaders } from '../Bus/lib/api';

type User = { email: string; role: string; token?: string; name?: string };
type Signup = { email: string; name?: string; createdAt?: string };
type Bus = {
  _id: string;
  name: string;
  location?: string;
  departureTime?: string;
  capacity?: number;
  signups: Signup[];
};

export default function BusList({ user, apiBase }: { user: User; apiBase: string }) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/buses`, { headers: getAuthHeaders(user.token) });
      if (!res.ok) throw new Error('Failed to fetch buses');
      const data = await res.json();
      setBuses(data);
    } catch (error) {
      console.error(error);
      alert('Error loading buses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function signup(busId: string) {
    const res = await fetch(`${apiBase}/api/buses/${busId}/signup`, {
      method: 'POST',
      headers: getAuthHeaders(user.token)
    });
    const data = await res.json();
    if (res.ok) setBuses(prev => prev.map(b => (b._id === data._id ? data : b)));
    else alert(data.error || 'Signup failed');
  }

  async function cancel(busId: string) {
    const res = await fetch(`${apiBase}/api/buses/${busId}/signup`, {
      method: 'DELETE',
      headers: getAuthHeaders(user.token)
    });
    const data = await res.json();
    if (res.ok) setBuses(prev => prev.map(b => (b._id === data._id ? data : b)));
    else alert(data.error || 'Cancel failed');
  }

  async function removeBus(busId: string) {
    if (!confirm('Delete this bus?')) return;
    const res = await fetch(`${apiBase}/api/buses/${busId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(user.token)
    });
    if (res.ok) setBuses(prev => prev.filter(b => b._id !== busId));
    else {
      const err = await res.json();
      alert(err.error || 'Delete failed');
    }
  }

  if (loading)
    return (
      <div className="text-center text-[#b0b0b0] mt-6 text-lg animate-pulse">
        Loading buses...
      </div>
    );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-[#0078d4] mb-4 text-center">Buses</h2>
      {buses.length === 0 && (
        <div className="text-center text-[#b0b0b0]">No buses available yet.</div>
      )}
      <ul className="space-y-4">
        {buses.map(bus => {
          const isSignedUp = bus.signups.some(s => s.email === user.email);
          return (
            <li
              key={bus._id}
              className="border border-[#444] bg-[#1e1e1e] rounded-lg p-5 shadow-md hover:shadow-lg hover:border-[#0078d4] transition"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0]">{bus.name}</h3>
                  {bus.location && (
                    <p className="text-sm text-[#b0b0b0]">Location: {bus.location}</p>
                  )}
                  <p className="text-sm text-[#b0b0b0]">
                    Departure:{' '}
                    {bus.departureTime
                      ? new Date(bus.departureTime).toLocaleString()
                      : 'TBD'}
                  </p>
                  <p className="text-sm text-[#b0b0b0]">
                    Capacity: {bus.signups.length}/{bus.capacity || '∞'}
                  </p>
                </div>

                <div className="flex flex-col gap-2 self-center">
                  {user.role === 'student' && !isSignedUp && (
                    <button
                      onClick={() => signup(bus._id)}
                      className="px-4 py-2 bg-[#0078d4] text-white font-medium rounded-md hover:bg-[#005fa3] active:scale-95 transition-transform"
                    >
                      Sign Up
                    </button>
                  )}

                  {user.role === 'student' && isSignedUp && (
                    <button
                      onClick={() => cancel(bus._id)}
                      className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                  )}

                  {user.role === 'admin' && (
                    <>
                      <button
                        onClick={() => alert(JSON.stringify(bus.signups, null, 2))}
                        className="px-4 py-2 bg-[#0078d4] text-white font-medium rounded-md hover:bg-[#005fa3] active:scale-95 transition-transform"
                      >
                        View Signups ({bus.signups.length})
                      </button>
                      <button
                        onClick={() => removeBus(bus._id)}
                        className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 active:scale-95 transition-transform"
                      >
                        Delete Bus
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}