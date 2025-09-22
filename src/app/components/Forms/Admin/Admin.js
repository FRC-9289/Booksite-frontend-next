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

  const loadSubmissions = (query = '') => {
    const saved = JSON.parse(localStorage.getItem('submissions')) || [];

    const filtered = saved
      .map((s, i) => {
        const combined = `${s['student-id']} ${s['student-name']} ${s['student-email']}`.toLowerCase();
        const matchScore = combined.includes(query.toLowerCase()) ? 1 : 0;
        return { s, i, matchScore };
      })
      .filter((x) => x.matchScore > 0 || query === '')
      .sort((a, b) => b.matchScore - a.matchScore)
      .reverse();

    setSubmissions(filtered);
  }; //This should be on backend, why is it on frontend

  const updateStatus = (index, action) => {
    const saved = JSON.parse(localStorage.getItem('submissions')) || [];

    if (action === 'approve') {
      saved[index].approved = true;
      saved[index].revoked = false;
    } else if (action === 'revoke') {
      saved[index].approved = false;
      saved[index].revoked = true;
    }

    localStorage.setItem('submissions', JSON.stringify(saved));
    loadSubmissions(search);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Dashboard</h2>
      <input
        type="text"
        placeholder="Search by ID, Name, or Email..."
        className={styles.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map(({ s, i }) => (
          <div className={styles.submission} key={i}>
            <p><strong>ID:</strong> {s['student-id']}</p>
            <p><strong>Name:</strong> {s['student-name']}</p>
            <p><strong>Email:</strong> {s['student-email']}</p>
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
              <button onClick={() => updateStatus(i, 'approve')} className={styles.button}>
                Approve
              </button>
            )}
            {s.approved && (
              <button onClick={() => updateStatus(i, 'revoke')} className={`${styles.button} ${styles.revoke}`}>
                Revoke
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
