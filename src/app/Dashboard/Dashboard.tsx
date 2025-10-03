'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { redirect, useRouter } from 'next/navigation';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) setUserName(name);
    else redirect('/SignIn');
  }, []);

  const handleGoToForms = () => {
    if (localStorage.getItem('userEmail').endsWith('@s.thevillageschool.com')) {
      router.push('/Forms/Student');
    } else if (localStorage.getItem('userEmail').endsWith('@s.thevillageschool.com')) {
      router.push('/Forms/Admin');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome, {userName}!</h1>
        <p className={styles.status}>Your dashboard is ready.</p>
        <button className={styles.signInButton}>Go to Forms</button>
      </div>
    </div>
  );
}
