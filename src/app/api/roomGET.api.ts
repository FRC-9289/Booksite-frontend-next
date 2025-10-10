export async function roomGET(room: string): Promise<string[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room-get`);
  url.searchParams.append('room', room);
  url.searchParams.append('grade', "10");

  const res = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch students of room ${room}`);
  }

  return (await res.json()).students as string[];
}

export async function roomsGET(): Promise<string[]> {  // <-- return type fixed
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms-get`);
  url.searchParams.append('grade', "10");

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }

  const data = await res.json();  // store JSON once
  console.log(Object.keys(data));

  return Object.keys(data);  // this is string[]
}
