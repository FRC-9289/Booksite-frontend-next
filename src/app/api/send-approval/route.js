import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Village Robotics Sign-Up Approved',
      text: `Hello ${name},\n\nCongratulations! Your Village Robotics 9289 signup has been approved. Welcome aboard!\n\n— The Village Robotics Team`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}