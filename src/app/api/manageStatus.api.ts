export default async function manageStatus(id: string, status: string){
    console.log(`${process.env.NEXT_PUBLIC_API_KEY}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submissions/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status})
    });

    if(res.ok){
        return {message: 'Status updated successfully'};
    } else {
        return {error: 'Failed to update status', message : (await res.json()).message};
    }
}