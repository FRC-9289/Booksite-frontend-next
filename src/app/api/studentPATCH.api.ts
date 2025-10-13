export async function studentPATCH(grade: number, email: string, status: number ) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/student-patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ grade, email, status }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update student: ${res.status} ${text}`);
  }

  return await res.json();
}
//Wolfram121