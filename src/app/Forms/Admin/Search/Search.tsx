'use client';

import { useEffect, useState } from 'react';
import { studentGET } from '../../../api/studentGET.api';
import styles from './Search.module.css';

interface StudentData {
  email: string;
  grade: number;
  room: string;
  pdfs: string[];
}

export default function AdminSearch() {
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    return () => {
      student?.pdfs.forEach(URL.revokeObjectURL);
    };
  }, [student]);

  const handleSearch = async () => {
    if (!email || !grade) {
      setStatus('Please provide both email and grade to search.');
      setStudent(null);
      return;
    }

    student?.pdfs.forEach(URL.revokeObjectURL);

    try {
      const result = await studentGET(email, Number(grade));
      if (!result) {
        setStudent(null);
        setStatus('No student found.');
        return;
      }

      const pdfUrls = (result.pdfs || []).map((blob) =>
        URL.createObjectURL(blob)
      );

      setStudent({
        email,
        grade: Number(grade),
        room: result.room || '',
        pdfs: pdfUrls,
      });
      setStatus('');
    } catch (err) {
      console.error('Search failed:', err);
      setStudent(null);
      setStatus('Failed to fetch student.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin – Search Student</h2>

      <div className={styles.searchContainer}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <label>Grade:</label>
        <select
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
          className={styles.input}
        >
          <option value="">-- Select Grade --</option>
          {Array.from({ length: 4 }, (_, i) => 9 + i).map((g) => (
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
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>Room:</strong> {student.room}</p>

          <div className={styles.pdfContainer}>
            <p><strong>PDFs:</strong></p>
            {student.pdfs.length > 0 ? (
              <div className={styles.pdfButtonContainer}>
                {student.pdfs.map((url, i) => (
                  <button
                    key={i}
                    className={styles.pdfButton}
                    onClick={() => window.open(url, "_blank")}
                  >
                    PDF {i + 1}
                  </button>
                ))}
              </div>
            ) : (
              <p>No PDFs available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
//Wolfram121