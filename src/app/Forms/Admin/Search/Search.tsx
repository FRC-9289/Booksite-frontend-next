'use client';

import { useEffect, useState } from 'react';
import { studentGET, studentsGET } from '../../../api/studentGET.api';
import { approveStudent } from '../../../api/studentPATCH.api';
import styles from './Search.module.css';

interface StudentData {
  email: string;
  grade: number;
  room: string;
  pdfs: string[];
  approved?: boolean;
}

export default function AdminSearch() {
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [unapproved, setUnapproved] = useState<StudentData[]>([]);
  const [status, setStatus] = useState('');

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      student?.pdfs.forEach(URL.revokeObjectURL);
      unapproved.forEach(u => u.pdfs.forEach(URL.revokeObjectURL));
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

      // Fetch main student if email is provided
      if (email) {
        const s = await studentGET(email, gradeNum);
        mainStudent = {
          email,
          grade: gradeNum,
          room: s.room || '',
          pdfs: (s.pdfs || []).map(b => URL.createObjectURL(b)),
          approved: s.approved
        };
      }
      setStudent(mainStudent);

      // Fetch all students for the grade
      const all = await studentsGET(gradeNum);

      // Filter and map unapproved students in a single pass
      const unapprovedList = all
        .filter(s => !s.approved && s.email !== email)
        .map(s => ({
          ...s,
          grade: gradeNum,
          pdfs: (s.pdfs || []).map(b => URL.createObjectURL(b))
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
      await approveStudent(s.grade, s.email, true);
      setUnapproved(prev => prev.filter(u => u.email !== s.email));
      setStatus(`Approved ${s.email}`);
    } catch (err) {
      console.error(err);
      setStatus(`Failed to approve ${s.email}`);
    }
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
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} className={styles.button}>
          Search
        </button>
      </div>

      {status && <p className={styles.status}>{status}</p>}

      {student && (
        <div className={styles.resultContainer}>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Grade:</strong> {student.grade}
          </p>
          <p>
            <strong>Room:</strong> {student.room}
          </p>
          <div className={styles.pdfButtonContainer}>
            {student.pdfs.map((url, i) => (
              <button
                key={i}
                className={styles.pdfButton}
                onClick={() => window.open(url, '_blank')}
              >
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
              <p>
                <strong>Email:</strong> {s.email}
              </p>
              <p>
                <strong>Room:</strong> {s.room}
              </p>
              <div className={styles.pdfButtonContainer}>
                {s.pdfs.map((url, j) => (
                  <button
                    key={j}
                    className={styles.pdfButton}
                    onClick={() => window.open(url, '_blank')}
                  >
                    PDF {j + 1}
                  </button>
                ))}
              </div>
              <button
                className={styles.button}
                onClick={() => handleApprove(s)}
              >
                Approve
              </button>
            </div>
          ))}
        </fieldset>
      )}
    </div>
  );
}
//Wolfram121