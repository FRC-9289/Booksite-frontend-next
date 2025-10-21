export async function studentGET(email: string, grade: number): Promise<{ room?: string; pdfs?: Blob[]; status?: number }> {
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
  let room: string | undefined;
  if (roomBlob instanceof Blob) {
    const text = (await roomBlob.text()).trim();
    room = text || undefined;
  }

  const statusBlob = form.get('status');
  let status: number | undefined;
  if (statusBlob instanceof Blob) {
    const text = (await statusBlob.text()).trim();
    status = text ? Number(text) : undefined;
  }

  const pdfs: Blob[] = [];
  for (const [key, value] of form.entries()) {
    if (key.startsWith("pdf_") && value instanceof Blob) {
      pdfs.push(value);
    }
  }

  return { room, pdfs, status };
}

export async function studentsGET(grade: number): Promise<{ email: string; room: string; status: number; pdfs: Blob[] }[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/students-get`);
  url.searchParams.append("grade", grade.toString());

  const res = await fetch(url.toString(), {
    headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch students: ${await res.text()}`);
  }

  const contentType = res.headers.get("Content-Type") || "";
  if (!contentType.includes("multipart/form-data")) {
    throw new Error(`Unexpected content type: ${contentType}`);
  }

  const form = await res.formData();
  const students: { email: string; room: string; status: number; pdfs: Blob[] }[] = [];

  const studentMap: Record<number, { email?: string; room?: string; status?: number; pdfs: Blob[] }> = {};

  for (const [key, value] of form.entries()) {
    const match = key.match(/^student_(\d+)_(.+)$/);
    if (!match) continue;
    const index = parseInt(match[1]);
    const field = match[2];
    const entry = (studentMap[index] ||= { pdfs: [] });

    if (field === "email" && value instanceof Blob)
      entry.email = (await value.text()).trim();
    else if (field === "room" && value instanceof Blob)
      entry.room = (await value.text()).trim();
    else if (field === "status" && value instanceof Blob)
      entry.status = parseInt((await value.text()).trim(), 10);
    else if (field.startsWith("pdf_") && value instanceof Blob)
      entry.pdfs.push(value);
  }

  for (const idx of Object.keys(studentMap)) {
    const s = studentMap[+idx];
    if (s.email) students.push({ email: s.email!, room: s.room || "", status: s.status ?? 0, pdfs: s.pdfs });
  }

  return students;
}
//Wolfram121