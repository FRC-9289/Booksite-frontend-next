export default async function sendEmail(email: string, status: string) {
  console.log("Sending email to:", email, "for status:", status);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify({ email, status }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Email send failed:", text);
    throw new Error(`Failed to send email: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}
