export default async function createGradeConfig(grade: string, maleRooms: number[], femaleRooms: number[]) {
  console.log("Creating grade config:", grade, maleRooms, femaleRooms);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/create-grade-config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ grade, maleRooms, femaleRooms }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Create grade config failed:", text);
    throw new Error(`Failed to create grade config: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
