export default async function getsubmissions(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    });
}