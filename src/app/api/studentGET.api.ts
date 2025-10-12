export async function studentGET(email: string, grade: number): Promise<{ room?: string; pdfs?: Blob[] }> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/student-get`);
  url.searchParams.append('email', email);
  url.searchParams.append('grade', grade.toString());

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch student data: ${await res.text()}`);
  }

  if (!(res.headers.get("Content-Type") || "").includes("multipart/form-data")) {
    throw new Error(`Unexpected response: ${JSON.stringify(await res.json())}`);
  }

  const form = await res.formData();
  const jsonBlob = form.get('data');
  if (!jsonBlob) throw new Error('Missing data part in response');

  const data = JSON.parse(await (jsonBlob as Blob).text()) as { room?: string };

  const pdfs: Blob[] = [];
  for (const [key, value] of form.entries()) {
    if (key.startsWith("pdf_") && value instanceof Blob) {
      pdfs.push(value);
    }
  }

  return { ...data, pdfs };
}
//Wolfram121