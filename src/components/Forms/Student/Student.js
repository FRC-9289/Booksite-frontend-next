'use client';

import { useState, useEffect } from 'react';
import styles from './Student.module.css';

export default function StudentSignUp() {
  const [formData, setFormData] = useState({
    'student-id': '',
    'student-name': '',
    'student-email': '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submissions =
      JSON.parse(localStorage.getItem('submissions')) || [];

    submissions.push({ ...formData, approved: false });

    localStorage.setItem('submissions', JSON.stringify(submissions));

    setStatus('Submitted successfully!');
    setFormData({
      'student-id': '',
      'student-name': '',
      'student-email': '',
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Village Robotics 9289 Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.group}>
          <label htmlFor="student-id" className={styles.label}>Student ID *</label>
          <input
            type="text"
            id="student-id"
            name="student-id"
            value={formData['student-id']}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="student-name" className={styles.label}>Name *</label>
          <input
            type="text"
            id="student-name"
            name="student-name"
            value={formData['student-name']}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="student-email" className={styles.label}>Email *</label>
          <input
            type="email"
            id="student-email"
            name="student-email"
            value={formData['student-email']}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Sign Up</button>
        <p className={styles.status}>{status}</p>
      </form>
    </div>
  );
}
