'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useRouter } from 'next/navigation';
import AdminBusPage from '../Bus/admin';
import StudentBusPage from '../Bus/student';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');

    if (name && email) {
      setUserName(name);
      setUserEmail(email);
    } else {
      router.push('/SignIn');
    }
  }, [router]);

  const handleGoToForms = () => {
    if (userEmail.endsWith('@s.thevillageschool.com')) {
      router.push('/Bus/student');
    } else if (userEmail.endsWith('@thevillageschool.com')) {
      router.push('/Bus/admin');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome, {userName}!</h1>
        <p className={styles.status}>Your dashboard is ready.</p>

        {userEmail.endsWith('@s.thevillageschool.com') && (
          <button className={styles.signInButton} onClick={handleGoToForms}>
            Go to Bus Signup
          </button>
        )}

        {userEmail.endsWith('@thevillageschool.com') && (
          <button className={styles.signInButton} onClick={handleGoToForms}>
            Manage Buses
          </button>
        )}
      </div>
    </div>
  );
}