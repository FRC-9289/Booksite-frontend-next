'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import styles from './SignIn.module.css';

export default function StudentLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      // Save user info to localStorage
      localStorage.setItem('userEmail', session.user.email);
      localStorage.setItem('userName', session.user.name);
      // Redirect to Dashboard
      router.push('/Dashboard');
    }
  }, [session, router]);

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
