'use client';

import styles from './Student.module.css';
import { signIn, useSession } from 'next-auth/react';

export default function StudentLogin() {
  const { data: session } = useSession(); // <-- get session info

  const handleGoogleSignIn = () => {
    signIn('google'); // triggers Google sign-in
  };

  return (
      <div className={styles.container}>
        <h2>Student Login</h2>

        {/* If user is logged in, show their info */}
        {session ? console.log(session.user) : (
          <>
            <p>This is a placeholder for the Student Login component.</p>
            <button className={styles.googleButton} onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          </>
        )}
      </div>
  );
}
