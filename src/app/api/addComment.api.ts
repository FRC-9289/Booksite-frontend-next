export default async function addComment(submissionId: string, comment: string) {
  console.log("Adding comment to submission:", submissionId, "comment:", comment);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ submissionId, comment }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Add comment failed:", text);
    throw new Error(`Failed to add comment: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
