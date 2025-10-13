export default async function updateStatus(submissionId: string, newStatus: string) {
    console.log("Updating status for submission:", submissionId, "to", newStatus);
  
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage-status`);
    url.searchParams.append("submissionId", submissionId);
    url.searchParams.append("status", newStatus);
  
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    });
  
    if (!res.ok) {
      const text = await res.text();
      console.error("Status update failed:", text);
      throw new Error(`Failed to update status: ${res.status} ${res.statusText}`);
    }
  
    return await res.json();
  }
  