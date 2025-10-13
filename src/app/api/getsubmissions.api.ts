export default async function getsubmissions(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    });

    return res.json();
}