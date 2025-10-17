export async function pushComment(comment: string, submissionId: string){
    const res = await fetch(`${process.env.PUBLIC_NEXT_BACKEND_URL}/api/admin/add-comment`, {
        method: "POST",
        headers : {
            "Authorization" : `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        },
        body : JSON.stringify({
            comment,
            submissionId
        })
    })

    if(!res.ok){
        throw new Error("Failed to add comment");
    }
    else {
        return res.json();
    }
}

export async function deleteComment(commentId: string){
    const res = await fetch(`${process.env.PUBLIC_NEXT_BACKEND_URL}/api/admin/deleteComment`)
}