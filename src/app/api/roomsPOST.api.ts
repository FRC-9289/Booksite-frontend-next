export async function createRoomsPOST(grade: number, rooms: string[]): Promise<any> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/rooms-post`);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ grade, rooms }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create rooms: ${res.status} ${text}`);
  }

  return await res.json();
}
//Wolfram121