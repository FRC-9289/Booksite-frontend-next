'use client';

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import StudentLogin from './SignIn/SignIn';

export default function SignUpPage() {
  redirect('/Forms/Admin/Dashboard');
}
