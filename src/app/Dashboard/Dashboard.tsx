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

  const handleGoToBus = () => {
    if (userEmail.endsWith('@s.thevillageschool.com')) {
      // Student user
      const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
      const studentId = localStorage.getItem('current-student-id');
  
      const student = submissions.find(
        (s) => s['student-id'] === studentId && s.approved
      );
  
      if (student) {
        router.push('/Bus/student'); // Approved → go to student dashboard
      } else {
        alert('Your account has not been approved by an admin yet.');
        router.push('/Forms/Student'); // Not approved → go back to form
      }
    } else if (userEmail.endsWith('@thevillageschool.com')) {
      // Admin user
      router.push('/Bus/admin');
    }
  };

  const handleGoToAdmin = () => {
    router.push('/Forms/Admin');
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome, {userName}!</h1>
        <p className={styles.status}>Your dashboard is ready.</p>

        {userEmail.endsWith('@s.thevillageschool.com') && (
          <button className={styles.signInButton} onClick={handleGoToBus}>
            Go to Bus Signup
          </button>
        )}

        {userEmail.endsWith('@thevillageschool.com') && (
          <><button className={styles.signInButton} onClick={handleGoToBus}>
            Manage Buses
          </button><button className={styles.signInButton} onClick={handleGoToAdmin}>
              Manage Form Submissions
            </button></>
        )}
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const studentId = localStorage.getItem('current-student-id');

    fetch(`/api/submissions/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'approved') {
          setApproved(true);
        } else {
          router.push('/Forms/Student');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p>Loading your dashboard...</p>;

  return approved ? (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>You now have access to the student dashboard.</p>
    </div>
  ) : (
    <p>Redirecting...</p>
  );
}