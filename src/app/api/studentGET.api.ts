export async function studentGET(name?: string, email?: string): Promise<{ room?: string; pdfs?: Blob[] }> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students`);
  url.searchParams.append('email', email);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch student data');
  }

  const form = await res.formData();
  const jsonBlob = form.get('data');
  if (!jsonBlob) throw new Error('Missing data part in response');

  const data = JSON.parse(await (jsonBlob as Blob).text()) as { student: any };

  // Extract PDFs
  const pdfs: Blob[] = [];
  for (let i = 0; i < 3; i++) {
    const pdf = form.get(`pdf_${i}`);
    if (pdf instanceof Blob) {
      pdfs.push(pdf);
    }
  }

  return { ...data.student, pdfs };
}
//Wolfram121