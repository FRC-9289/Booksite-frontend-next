export async function studentGET(email?: string): Promise<{ room?: string; pdfs?: Blob[] }> {
  if (!email) throw new Error("Email is required");

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/students`);
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

  const data = await res.json(); // JSON is an array
  console.log(data);

  if (!data || data.length === 0) return { room: undefined, pdfs: [] };

  const student = data[0]; // <-- pick the first submission

  // Convert pdfBase64 to Blob
  const pdfs: Blob[] = (student.pdfFiles || []).map((pdf: any) => {
    const byteCharacters = atob(pdf.pdfBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/pdf" });
  });

  return {
    room: student.room,
    pdfs
  };
}
