export async function roomGET(room: string, grade: string): Promise<{ name: string; status: string }[]> {
  console.log('Fetching students for room:', room);
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/room-get`);
  url.searchParams.append('room', room);
  url.searchParams.append('grade', grade);

  const res = await fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch students of room ${room}`);
  }

  return (await res.json()).students as{ name: string; status: string }[];
}

export async function roomsGET(grade: string): Promise<string[]> {  // <-- return type fixed
  console.log('Fetching all rooms for: ', grade);

  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms-get`);
  url.searchParams.append('grade', grade);

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
