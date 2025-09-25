'use client';

import { SessionProvider } from 'next-auth/react';
import StudentSignUpFormExtras from '../app/components/Extras/StudentSignUpFormExtras';
import Admin from '../app/components/Forms/Admin/Admin';
import StudentSignUp from '../app/components/Forms/Student/Student';
import StudentLogin from '../app/components/Login/Student/Student';

export default function SignUpPage() {
  return (
    <main>
      <SessionProvider>
      <StudentLogin />
      </SessionProvider>
      
    </main>
  );
}