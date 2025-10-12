'use client';

import { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import getsubmissions from '../../api/getsubmissions.api';

export default function Admin() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    // ✅ Runs only in the browser
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    setLoading(false);
  }, []);

  const loadSubmissions = async () => {
    const res = await getsubmissions();
  
    // Strip large base64s
    const lightweight = res.map(s => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      status: s.status,
      grade: s.grade,
      room: s.room
    }));
  
    localStorage.setItem('submissions_meta', JSON.stringify(lightweight));
    setSubmissions(res);
  };
  

  useEffect(() => {
    if (isAdmin) loadSubmissions();
  }, [isAdmin]);

  if (loading) return <p>Loading...</p>;

  const getColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Approved':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s._id?.toLowerCase().includes(term) ||
      ("Bus "+s.room[0]).toLowerCase().includes(term) ||
      ("Room "+s.room[2]).toLowerCase().includes(term) ||
      (s.room[1] == "M" ? "Male" : "Female").toLowerCase().includes(term) ||
      s.status.toLowerCase().includes(term);
  
    const matchesGrade = gradeFilter ? s.grade.toString() === gradeFilter : true;
  
    return matchesSearch && matchesGrade;
  });
  

  return (
    <>
      {!isAdmin ? (
        <div className={styles.container}>
        <div className={styles.headerRow}>
          <select
            onChange={(e) => setGradeFilter(e.target.value)}
            className={styles.gradeSelect}
            defaultValue=""
          >
            <option value="">All Grades</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <h2 className={styles.heading}>Admin Dashboard</h2>
        </div>
  
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
            filteredSubmissions.map((submission, i) => (
              <div className={styles.submission} key={i}>
                <p><strong>Submission ID:</strong> {submission._id}</p>
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Grade:</strong> {submission.grade}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p><strong>Bus:</strong> {submission.room[0]}</p>
                <p>
                  <strong>Room:</strong>{" "}
                  {submission.room[1] === "M" ? "Male" : "Female"}{" "}
                  {submission.room[2]}
                </p>
  
                {/* Display uploaded files */}
                <div className={styles.filesContainer}>
              {submission.filesData?.map((file, j) => (
                <div key={j}>
                <label className={styles.fileLabel}>PDF {j+1}</label>
                <button
                  className={styles.fileButton}
                  onClick={() => {
                    // Convert Base64 → Blob → Object URL
                    const byteCharacters = atob(file.base64);
                    const byteNumbers = new Array(byteCharacters.length)
                      .fill(0)
                      .map((_, i) => byteCharacters.charCodeAt(i));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    const blobUrl = URL.createObjectURL(blob);
              
                    // Open in a new tab
                    window.open(blobUrl, "_blank");
                  }}
                >
                  {file.fileName}
                </button>
                </div>
              ))}
            </div>
            <div className={styles.statusContainer}>
                  <p style={{ color: getColor(submission.status) }}>
                    {submission.status}
                    
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <p className={styles.accessDenied}>
          Access Denied. You are not an admin.
        </p>
      )}
    </>
  );
  
}