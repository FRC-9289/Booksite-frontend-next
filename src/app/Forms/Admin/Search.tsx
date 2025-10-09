'use client';

import { useEffect, useState } from 'react';
import { studentGET } from '../../api/studentGET.api';
import styles from './Admin.module.css';

interface StudentData {
  email: string;
  grade: number;
  room: string;
  pdfs: Blob[];
}

export default function AdminSearch() {
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState<number | ''>('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    if (!email && !grade) {
      setStatus('Please provide an email or grade to search.');
      return;
    }

    try {
      const result = await studentGET(email || undefined, grade ? Number(grade) : undefined);

      if (!result) {
        setStudent(null);
        setStatus('No student found.');
        return;
      }

      setStudent({
        email,
        grade: grade ? Number(grade) : 0,
        room: result.room,
        pdfs: result.pdfs,
      });
      setStatus('');
    } catch (err) {
      console.error(err);
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
          {Array.from({ length: 8 }, (_, i) => 5 + i).map((g) => (
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

          <div className={styles.pdfContainer}>
            <p>PDFs:</p>
            {student.pdfs.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                PDF {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}