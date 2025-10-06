export default async function studentPOST(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/post-students`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    body: formData
  });

  console.log(`formData: ${formData.get('email')}, ${formData.get('room')}, ${formData.get('file1')}, ${formData.get('file2')}, ${formData.get('file3')}`);

  if (!res.ok) {
    throw new Error(`Failed to submit: ${res.statusText}`);
  }

  return await res.json();
}