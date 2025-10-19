export async function getGradeConfig(grade: string) {
  console.log("Fetching grade config for grade:", grade);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/get-grade-config?grade=${grade}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Get grade config failed:", text);
    throw new Error(`Failed to get grade config: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.config; // Return the config object
}

export async function createGradeConfig(grade: string, maleRooms: number[], femaleRooms: number[]) {
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
