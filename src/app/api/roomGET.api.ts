export async function roomGET(room: string): Promise<string[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/room-get`);
    url.searchParams.append('room', room);

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

export async function roomsGET(): Promise<string[][]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wolf/rooms-get`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }

  return (await res.json()).rooms as string[][];
}
//Wolfram121