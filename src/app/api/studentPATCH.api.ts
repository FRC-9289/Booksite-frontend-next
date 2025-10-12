import { sendApprovalEmail } from "../../../utils/sendApprovalEmail";

export async function approveStudent(grade: number, email: string, approved: boolean, userName: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wolf/student-patch`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ grade, email, approved }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update student: ${res.status} ${text}`);
  }

  const result = await res.json();

  // Send approval email if the student is approved
  if (approved) {
    try {
      await sendApprovalEmail(email, userName);
    } catch (error) {
      console.error("Failed to send approval email:", error);
    }
  }

  return result;
}
//Wolfram121