export default async function updateFileStatus(submissionId: string, fileId: string, newStatus: string) {
    console.log("Updating file status for submission:", submissionId, "file:", fileId, "to", newStatus);

    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/manage-file-status`);
    url.searchParams.append("submissionId", submissionId);
    url.searchParams.append("fileId", fileId);
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
      console.error("File status update failed:", text);
      throw new Error(`Failed to update file status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
}
