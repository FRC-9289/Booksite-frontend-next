export async function approveStudent(grade: number, email: string, approved: boolean) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/student-patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ grade, email, approved }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update student: ${res.status} ${text}`);
  }

  return await res.json();
}
//Wolfram121