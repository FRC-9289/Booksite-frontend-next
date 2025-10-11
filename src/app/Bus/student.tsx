'use client';

import { useEffect, useState } from 'react';

export default function StudentBusPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses`)
      .then(res => res.json())
      .then(data => {
        setBuses(data);
        setLoading(false);
      });
  }, []);

  const handleJoinBus = async () => {
    const email = localStorage.getItem('userEmail');
    if (!email || !selectedBus) return alert('Select a bus first.');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/buses/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ busId: selectedBus, email })
    });

    if (res.ok) alert('You have been added to the bus!');
    else alert('Error signing up for the bus.');
  };

  if (loading) {
    return <p className="text-center text-[#b0b0b0] mt-6 animate-pulse">Loading buses...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-[#2a2a2a] rounded-xl shadow-lg text-[#e0e0e0]">
      <h2 className="text-2xl font-semibold text-[#0078d4] mb-6 text-center">Select a Bus</h2>

      <div className="mb-4">
        <label className="block text-[#b0b0b0] mb-2">Bus:</label>
        <select
          value={selectedBus}
          onChange={e => setSelectedBus(e.target.value)}
          className="w-full p-2 rounded-md bg-[#1e1e1e] border border-[#444] text-[#e0e0e0] focus:border-[#0078d4] focus:ring focus:ring-[#0078d4]/30 outline-none transition"
        >
          <option value="">-- Choose a bus --</option>
          {buses.map(bus => (
            <option key={bus._id} value={bus._id}>
              {bus.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleJoinBus}
        className="w-full bg-[#0078d4] text-white font-medium py-2 rounded-md hover:bg-[#005fa3] active:scale-95 transition-transform"
      >
        Join Bus
      </button>
    </div>
  );
}