export default async function studentPOST(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    body: formData
  });

  if (!res.ok) {
    throw new Error(`Failed to submit: ${res.statusText}`);
  }

  return await res.json();
}