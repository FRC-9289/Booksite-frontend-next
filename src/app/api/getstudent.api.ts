type StudentInfo = {
  email: string;
  id: number;
  room?: number;
  pdfs?: Blob[];
};

type Response = {
  openRooms: string[];
  student: StudentInfo;
};

export default async function getstudent(email: string): Promise<Response> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`);
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
  const data = JSON.parse(await (jsonBlob as Blob).text()) as Omit<Response, 'student'> & { student: any };

  // Extract PDFs (assumed returned as pdf_0, pdf_1, pdf_2)
  const pdfs: Blob[] = [];
  for (let i = 0; i < 3; i++) {
    const pdf = form.get(`pdf_${i}`);
    if (pdf instanceof Blob) pdfs.push(pdf);
  }

  const student: StudentInfo = {
    ...data.student,
    pdfs,
  };

  return {
    openRooms: data.openRooms,
    student,
  };
}
