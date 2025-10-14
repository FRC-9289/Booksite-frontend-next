export default async function studentPOST(formData: FormData) {
  console.log("Submitting student form:", {
    email: formData.get("email"),
    room: formData.get("room"),
    grade: formData.get("grade"),
    name: formData.get("name"),
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student-post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Submission failed:", text);
    throw new Error(`Failed to submit: ${res.status} ${res.statusText}`);
  }

  const result = await res.json();

  return result;
}
