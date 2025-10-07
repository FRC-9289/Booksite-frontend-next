export default async function getsubmissions() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
      }
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch student data');
    }
  
    // ✅ Just parse the JSON directly
    const data = await res.json();
    return data; // array of submissions
  }
  