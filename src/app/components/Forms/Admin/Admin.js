'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    loadSubmissions(search);
  }, [search]);

  const loadSubmissions = async (query = '') => {
    try {
      const res = await fetch('http://localhost:5000/users'); // ✅ Fetch users from backend
      const data = await res.json();

      const filtered = data
        .map((s, i) => {
          const combined = `${s.name} ${s.email}`.toLowerCase();
          const matchScore = combined.includes(query.toLowerCase()) ? 1 : 0;
          return { s, i, matchScore };
        })
        .filter((x) => x.matchScore > 0 || query === '')
        .sort((a, b) => b.matchScore - a.matchScore)
        .reverse();

      setSubmissions(filtered);
    } catch (err) {
      console.error("Error loading submissions", err);
    }
  };

  const updateStatus = async (userId, action) => {
    try {
      if (action === 'approve') {
        await fetch(`http://localhost:5000/users/${userId}/approve`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        });
      } else if (action === 'revoke') {
        await fetch(`http://localhost:5000/users/${userId}/revoke`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // reload list after update
      loadSubmissions(search);
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Dashboard</h2>
      <input
        type="text"
        placeholder="Search by Name or Email..."
        className={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map(({ s }) => (
          <div className={styles.submission} key={s._id}>
            <p><strong>Name:</strong> {s.name}</p>
            <p><strong>Email:</strong> {s.email}</p>
            <p>
              <strong>Status: </strong>
              {s.revoked ? (
                <span className={styles.revoked}>❌ Revoked</span>
              ) : s.approved ? (
                <span className={styles.approved}>✅ Approved</span>
              ) : (
                <span className={styles.pending}>❌ Pending</span>
              )}
            </p>
            {!s.revoked && !s.approved && (
              <button onClick={() => updateStatus(s._id, 'approve')} className={styles.button}>
                Approve
              </button>
            )}
            {s.approved && (
              <button onClick={() => updateStatus(s._id, 'revoke')} className={`${styles.button} ${styles.revoke}`}>
                Revoke
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}