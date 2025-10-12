export async function studentGET(
  email: string,
  grade: number
): Promise<{ room?: string; pdfs?: Blob[]; approved?: boolean }> {
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

  const roomBlob = form.get('room');
  const room = roomBlob ? JSON.parse(await (roomBlob as Blob).text()) as string : undefined;

  const approvedBlob = form.get('approved');
  const approved = approvedBlob ? JSON.parse(await (approvedBlob as Blob).text()) as boolean : undefined;

  const pdfs: Blob[] = [];
  for (const [key, value] of form.entries()) {
    if (key.startsWith("pdf_") && value instanceof Blob) {
      pdfs.push(value);
    }
  }

  return { room, pdfs, approved };
}

export async function studentsGET(grade: number): Promise<{ email: string; room: string; approved: boolean; pdfs: Blob[] }[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/students-get`);
  url.searchParams.append("grade", grade.toString());

  const res = await fetch(url.toString(), {
    headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch students: ${await res.text()}`);
  }

  const students: any[] = await res.json();
  return students;
}
//Wolfram121