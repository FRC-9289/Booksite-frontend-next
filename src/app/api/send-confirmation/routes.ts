import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
    }

    // Create transporter using Gmail (or custom SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use 'smtp.mailtrap.io', etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose email
    const mailOptions = {
      from: `"The Village Robotics Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Submission Received",
      html: `
        <div style="font-family:sans-serif;">
          <h2>Hello ${name},</h2>
          <p>Thanks for your submission of your form to us!</p>
          <p>We’ll review your request and get back to you soon.</p>
          <p>Please keep checking this email inbox in the next coming days for approval from us.</p>
          <br/>
          <p>– The Village Robotics Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}