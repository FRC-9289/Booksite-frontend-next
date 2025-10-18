'use client';

import { useEffect, useState } from 'react';
import { studentGET, studentsGET } from '../../../api/studentGET.api';
import { studentPATCH } from '../../../api/studentPATCH.api';
import styles from './Search.module.css';

interface StudentData {
  email: string;
  grade: number;
  room: string;
  pdfs: Blob[]; // store the actual Blobs
  status?: number;
}

export default function AdminSearch() {
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [unapproved, setUnapproved] = useState<StudentData[]>([]);
  const [status, setStatus] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<StudentData | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Revoke object URLs when component unmounts / PDFs change
  useEffect(() => {
    return () => {
      const allBlobs = [student, ...unapproved].flatMap(s => s?.pdfs ?? []);
      allBlobs.forEach(b => URL.revokeObjectURL(b as any));
    };
  }, [student, unapproved]);

  const handleSearch = async () => {
    if (!grade) {
      setStatus('Please select a grade.');
      return;
    }

    try {
      const gradeNum = Number(grade);

      let mainStudent: StudentData | null = null;
      if (email) {
        const res = await studentGET(email, gradeNum);
        mainStudent = {
          email,
          grade: gradeNum,
          room: res.room || '',
          pdfs: res.pdfs || [],
          status: res.status,
        };
      }
      setStudent(mainStudent);

      const all = await studentsGET(gradeNum);
      const unapprovedList: StudentData[] = all
        .filter(s => s.status === 0 && s.email !== email)
        .map(s => ({
          ...s,
          grade: gradeNum,
          pdfs: s.pdfs || [],
        }));
      setUnapproved(unapprovedList);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus('Failed to fetch students.');
    }
  };

  const handleApprove = async (s: StudentData) => {
    try {
      await studentPATCH(s.grade, s.email, 1);
      setUnapproved(prev => prev.filter(u => u.email !== s.email));
      setStatus(`Approved ${s.email}`);
    } catch (err) {
      console.error(err);
      setStatus(`Failed to approve ${s.email}`);
    }
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    try {
      await studentPATCH(rejectTarget.grade, rejectTarget.email, -1, rejectReason);
      setUnapproved(prev => prev.filter(u => u.email !== rejectTarget.email));
      setStatus(`Rejected ${rejectTarget.email}`);
    } catch (err) {
      console.error(err);
      setStatus(`Failed to reject ${rejectTarget.email}`);
    } finally {
      setShowRejectModal(false);
      setRejectTarget(null);
      setRejectReason('');
    }
  };

  // Open PDF in new tab properly
  const openPdf = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
    // Optional: revoke after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin – Search Students</h2>

      <div className={styles.searchContainer}>
        <label>Email (optional):</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          type="email"
        />

        <label>Grade:</label>
        <select
          value={grade}
          onChange={e => setGrade(Number(e.target.value))}
          className={styles.input}
        >
          <option value="">-- Select Grade --</option>
          {Array.from({ length: 4 }, (_, i) => 9 + i).map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <button onClick={handleSearch} className={styles.button}>Search</button>
      </div>

      {status && <p className={styles.status}>{status}</p>}

      {student && (
        <div className={styles.resultContainer}>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Room:</strong> {student.room}</p>
          <div className={styles.pdfButtonContainer}>
            {student.pdfs.map((blob, i) => (
              <button key={i} className={styles.pdfButton} onClick={() => openPdf(blob)}>
                PDF {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {unapproved.length > 0 && (
        <fieldset className={styles.fieldset}>
          <legend>Unapproved Students</legend>
          {unapproved.map((s, i) => (
            <div key={i} className={styles.resultContainer}>
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>Room:</strong> {s.room}</p>
              <div className={styles.pdfButtonContainer}>
                {s.pdfs.map((blob, j) => (
                  <button key={j} className={styles.pdfButton} onClick={() => openPdf(blob)}>
                    PDF {j + 1}
                  </button>
                ))}
              </div>
              <button className={styles.button} onClick={() => handleApprove(s)}>Approve</button>
              <button className={styles.button} onClick={() => {
                setRejectTarget(s);
                setShowRejectModal(true);
              }}>Reject</button>
            </div>
          ))}
        </fieldset>
      )}

      {showRejectModal && rejectTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Reject {rejectTarget.email}</h3>
            <textarea
              className={styles.textarea}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={5}
            />
            <div className={styles.modalButtons}>
              <button className={styles.button} onClick={confirmReject}>Confirm Reject</button>
              <button className={styles.button} onClick={() => {
                setShowRejectModal(false);
                setRejectTarget(null);
                setRejectReason('');
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//Wolfram121