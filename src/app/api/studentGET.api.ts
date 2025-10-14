export async function studentGET(name: string, email: string, grade: string): Promise<{ room?: string; pdfs?: Blob[] }> {
  console.log('Fetching student data for:', {email, grade }, "from", process.env.NEXT_PUBLIC_BACKEND_URL);
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/student-get`);
  url.searchParams.append("email", email);
  url.searchParams.append("grade", grade);


  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if(!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch student data:", text);
    throw new Error(`Failed to fetch student data: ${res.status} ${res.statusText}`);
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