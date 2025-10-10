'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';

export default function Admin() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // ✅ new filter

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    loadSubmissions(search, filter);
  }, [search, filter]);

  const loadSubmissions = async (query = '', status = 'all') => {
    try {
      const res = await fetch(`/api/submissions?search=${encodeURIComponent(query)}&status=${status}`);
      if (!res.ok) throw new Error('Failed to load submissions');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      console.error('Error loading submissions:', err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      const updated = await res.json();

      // Send email if approved
      if (status === 'approved') {
        await fetch('/api/send-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: updated['student-email'],
            name: updated['student-name'],
          }),
        });
      }

      loadSubmissions(search, filter);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Dashboard</h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by ID, Name, or Email..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ filter dropdown */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.dropdown}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        submissions.map((s) => (
          <div className={styles.submission} key={s._id}>
            <p><strong>ID:</strong> {s['student-id']}</p>
            <p><strong>Name:</strong> {s['student-name']}</p>
            <p><strong>Email:</strong> {s['student-email']}</p>
            <p><strong>Status:</strong> {s.status}</p>

            {/* ✅ status control dropdown */}
            <select
              value={s.status}
              onChange={(e) => updateStatus(s._id, e.target.value)}
              className={styles.dropdown}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}