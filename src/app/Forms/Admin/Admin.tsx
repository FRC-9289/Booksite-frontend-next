'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../api/getsubmissions.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Runs only in the browser
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  const loadSubmissions = async () => {
    const res = await getsubmissions();
    localStorage.setItem('submissions', JSON.stringify(res));
    setSubmissions(res);
  };

  useEffect(() => {
    if (isAdmin) loadSubmissions();
  }, [isAdmin]);

  if (loading) return <p>Loading...</p>;

  const getColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s._id?.toLowerCase().includes(term) ||
      String(s.grade)?.toLowerCase().includes(term) ||
      ("Bus "+s.room[0]).toLowerCase().includes(term) ||
      ("Room "+s.room[2]).toLowerCase().includes(term) ||
      (s.room[1] == "M" ? "Male" : "Female").toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term)
    );
  });

  return (
    <>
      {!isAdmin ? (
        <div className={styles.container}>
          <h2 className={styles.heading}>Admin Dashboard</h2>

          <input
            type="text"
            placeholder="Search by Name, Email, Grade, SubmissionId, Bus (Bus [n]) Room (Room [n]) Gender (Male)..."
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredSubmissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            filteredSubmissions.map((s, i) => (
              <div className={styles.submission} key={i}>
                <p><strong>Submission ID:</strong> {s._id}</p>
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Grade:</strong> {s.grade}</p>
                <p><strong>Email:</strong> {s.email}</p>
                <p style={{ color: getColor(s.status) }}>
                  <strong>Status:</strong> {s.status}
                </p>
                <p><strong>Bus: </strong>{s.room[0]}</p>
                <p><strong>Room: </strong>{s.room[1] == "M" ? "Male" : "Female"} {s.room[2]}</p>
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
