'use client';

import { useEffect, useState } from 'react';

export default function AdminBusPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [newBus, setNewBus] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses`)
      .then(res => res.json())
      .then(data => setBuses(data));
  }, []);

  const handleAddBus = async () => {
    if (!newBus.trim()) return alert('Enter a bus name.');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBus.trim() })
    });

    if (!res.ok) return alert('Error adding bus');

    setNewBus('');
    const updated = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses`).then(res => res.json());
    setBuses(updated);
  };

  const handleDeleteBus = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses/${id}`, { method: 'DELETE' });
    if (!res.ok) return alert('Error deleting bus');
    setBuses(buses.filter(b => b._id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#2a2a2a] rounded-xl shadow-lg text-[#e0e0e0]">
      <h2 className="text-2xl font-semibold text-[#0078d4] mb-6 text-center">Manage Buses</h2>

      <div className="flex mb-6 gap-2">
        <input
          type="text"
          placeholder="New bus name"
          value={newBus}
          onChange={e => setNewBus(e.target.value)}
          className="flex-1 p-2 rounded-md bg-[#1e1e1e] border border-[#444] text-[#e0e0e0] focus:border-[#0078d4] focus:ring focus:ring-[#0078d4]/30 outline-none transition"
        />
        <button
          onClick={handleAddBus}
          className="bg-[#0078d4] text-white font-medium py-2 px-4 rounded-md hover:bg-[#005fa3] active:scale-95 transition-transform"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {buses.map(bus => (
          <li
            key={bus._id}
            className="flex justify-between items-center p-3 bg-[#1e1e1e] rounded-md border border-[#444]"
          >
            <span>{bus.name}</span>
            <button
              onClick={() => handleDeleteBus(bus._id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-800 active:scale-95 transition-transform"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}