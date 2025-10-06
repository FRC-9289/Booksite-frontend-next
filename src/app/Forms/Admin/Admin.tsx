'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../api/getsubmissions.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Only runs in browser
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadSubmissions(search);
  }, [isAdmin, search]);

  const loadSubmissions = async (query = '') => {
    const res = await getsubmissions();
    setSubmissions(res);
  };

  loadSubmissions();

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!isAdmin ? (
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
            submissions.map((s, i) => (
              <div className={styles.submission} key={i}>
                <p><strong>Submission ID:</strong> {s._id}</p>
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Email:</strong> {s.email}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <p className={styles.accessDenied}>Access Denied. You are not an admin.</p>
      )}
    </>
  );
}
