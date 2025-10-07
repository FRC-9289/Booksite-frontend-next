'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../api/getsubmissions.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Temporarily ignore admin check
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const res = await getsubmissions(); // array of submissions
      console.log(res);
      setSubmissions(res);
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;

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

      {filteredSubmissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        filteredSubmissions.map((sub) => (
          <div className={styles.submission} key={sub._id}>
            <p><strong>Submission ID:</strong> {sub._id}</p>
            <p><strong>Name:</strong> {sub.name}</p>
            <p><strong>Email:</strong> {sub.email}</p>
            <p><strong>Room:</strong> {sub.room}</p>

            {sub.pdfFiles?.map((pdf, i) => (
              <a
                className={styles.dload}
                key={i}
                href={`data:application/pdf;base64,${pdf.pdfBase64}`}
                download={`submission_${sub._id}_${i + 1}.pdf`}
                style={{ display: 'block', marginTop: '5px' }}
              >
                Download PDF: {sub.files[i].fileName}
              </a>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
