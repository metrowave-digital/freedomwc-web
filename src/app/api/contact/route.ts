import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { firstName, lastName, email, phone, message } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Admin email
    const adminEmail = process.env.FWC_ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email environment variable missing." },
        { status: 500 }
      );
    }

    // Compose email
    const emailBody = `
New Contact Submission (FWC Pathways Website)

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Message:
${message}
    `;

    // SEND EMAIL THROUGH RESEND
    const response = await resend.emails.send({
      from: "FWC Online <no-reply@freedomwc.org>",
      to: adminEmail,
      subject: "New Contact Form Submission",
      text: emailBody,
    });

    if (response.error) {
      console.error(response.error);
      return NextResponse.json(
        { error: "Error sending email via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    console.error("Contact API Error:", message);

    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
