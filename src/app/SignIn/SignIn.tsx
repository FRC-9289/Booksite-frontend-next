'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import styles from './SignIn.module.css';

export default function StudentLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const email = session.user.email || '';
      const name = session.user.name || '';

      // Save to localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);

      // Redirect based on email domain
      if (email.endsWith('@s.thevillageschool.com')) {
        router.push('/Forms/Student');
        localStorage.setItem('isAdmin', 'false');
      } else if (email.endsWith('@thevillageschool.com')) {
        router.push('/Forms/Admin/Central');
        localStorage.setItem('isAdmin', 'true');
      } else {
        alert('Please sign in with your school email.');
      }
    }
  }, [status, session, router]);

  const handleGoogleSignIn = () => {
    signIn('google');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <button className={styles.signInButton} onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
        {status === 'loading' && <p className={styles.status}>Loading...</p>}
        {status === 'unauthenticated' && <p className={styles.status}>Not signed in</p>}
      </div>
    </div>
  );
}
