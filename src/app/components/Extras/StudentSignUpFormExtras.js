'use client';
import { useState } from 'react';
import styles from './StudentSignUpFormExtras.module.css';
import auth from '../../api/auth.api';

export default function StudentSignUpFormExtras() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      auth(
        formData.get('student-id'), 
        formData.get('student-name'),
        formData.get('student-email'),
        formData.get('bus-choice')
      );
    } catch (error) {
      console.error('Error during authentication:', error);
      setStatus('Authentication failed. Please try again.');
      return;
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Village Robotics Bus Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.group}>
          <label htmlFor="student-id" className={styles.label}>Student ID *</label>
          <input type="text" id="student-id" name="student-id" required className={styles.input} />
        </div>
        <div className={styles.group}>
          <label htmlFor="student-name" className={styles.label}>Name *</label>
          <input type="text" id="student-name" name="student-name" required className={styles.input} />
        </div>
        <div className={styles.group}>
          <label htmlFor="student-email" className={styles.label}>Email *</label>
          <input type="email" id="student-email" name="student-email" required className={styles.input} />
        </div>
        <div className={styles.group}>
          <label htmlFor="bus-choice" className={styles.label}>Bus Choice *</label>
          <input type="text" id="bus-choice" name="bus-choice" required className={styles.input} />
        </div>
        <button type="submit" className={styles.button}>Sign Up</button>
        <p className={styles.status}>{status}</p>
      </form>
    </div>
  );
}
