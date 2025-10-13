export default async function updateStatus(submissionId: string, newStatus: string) {
  console.log("Updating status for submission:", submissionId, "to", newStatus);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ submissionId, status: newStatus }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Status update failed:", text);
    throw new Error(`Failed to update status: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
