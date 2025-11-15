 'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import StudentLogin from './SignIn/SignIn';
import CreateForms from './Forms/Admin/CreateForms/CreateForms';
import Student from './Forms/Student/PDFSubmit/Student';

export default function SignUpPage() {
  redirect('/SignIn');
}

// WAY TO TEST NEW FEATURES WITHOUT NEEDING TO NAVIGATE (BACKEND ISN'T RUNNING FOR SIGN IN FOR EXAMPLE)

// export default function SignUpPage() {
//   const [view, setView] = useState<'signin' | 'admin' | 'student'>('signin');

//   if (view === 'admin') {
//     return <CreateForms isAdmin={true} />;
//   }

//   if (view === 'student') {
//     return <Student />;
//   }

//   return (
//     <SessionProvider>
//       <div style={{ padding: '20px' }}>
//         <h1>Test Views</h1>
//         <button onClick={() => setView('admin')} style={{ margin: '10px', padding: '10px' }}>
//           Test Admin Create Forms
//         </button>
//         <button onClick={() => setView('student')} style={{ margin: '10px', padding: '10px' }}>
//           Test Student PDF Submit
//         </button>
//         <button onClick={() => setView('signin')} style={{ margin: '10px', padding: '10px' }}>
//           Go to Sign In
//         </button>
//         {view === 'signin' && <StudentLogin />}
//       </div>
//     </SessionProvider>
//   );
// }
