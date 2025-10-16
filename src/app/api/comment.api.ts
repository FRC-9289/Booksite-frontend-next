export async function addComment(comment: string){
    const res = await fetch(`${process.env.PUBLIC_NEXT_BACKEND_URL}/api/admin/addComment`, {
        method: "POST",
        headers : {
            "Authorization" : `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
    })
}

export async function deleteComment(commentId: string){
    const res = await fetch(`${process.env.PUBLIC_NEXT_BACKEND_URL}/api/admin/deleteComment`)
}