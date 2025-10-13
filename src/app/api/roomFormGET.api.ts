/**
 * Fetches the room forms given the grade level.
 * @param grade - The grade level to fetch the room form for.
 * @returns {
 *  roomAmtMale : [],
 *  roomAmtFemale : []
 * }
 */
export default async function roomFormGET(grade: string){
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/roomForm?grade=${grade}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if(res.ok){
        return res.json();
    } else {
        return {error: 'Failed to fetch room form', message : (await res.json()).message};
    }
}