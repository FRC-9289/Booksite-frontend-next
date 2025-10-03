'use client';

import { SessionProvider } from "next-auth/react";
import StudentLogin from "./SignIn";

export default function DashboardPage() {
  return (
  <SessionProvider>
    <StudentLogin />
  </SessionProvider>
    )
}
