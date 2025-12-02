import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const CMS_URL = process.env.CMS_URL!;
const ADMIN_EMAIL = process.env.PATHWAYS_ADMIN_EMAIL ?? "info@freedomwc.org";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    /* -------------------------------------------------
       Normalize name fields from whatever the frontend
       is actually sending (super defensive).
    -------------------------------------------------- */

    // Raw "full name" variants from frontend
    const rawFullNameInput: string =
      (data.fullName ||
        data.full_name ||
        data.name ||
        "") as string;

    let firstName: string =
      (data.firstName ||
        data.firstname ||
        data.first_name ||
        "") as string;

    let lastName: string =
      (data.lastName ||
        data.lastname ||
        data.last_name ||
        "") as string;

    // If we didn't get first/last explicitly, try to derive from rawFullNameInput
    const cleanedFullNameInput = (rawFullNameInput || "").trim();

    if (!firstName && cleanedFullNameInput) {
      firstName = cleanedFullNameInput.split(" ")[0];
    }

    if (!lastName && cleanedFullNameInput) {
      const parts = cleanedFullNameInput.split(" ");
      if (parts.length > 1) {
        lastName = parts.slice(1).join(" ");
      }
    }

    // Now compute final fullName with multiple fallbacks
    let fullName = `${firstName} ${lastName}`.trim();

    if (!fullName && cleanedFullNameInput) {
      fullName = cleanedFullNameInput;
    }

    if (!fullName) {
      fullName = "Pathways Applicant";
    }

    // Safe first name for email greeting
    const safeFirstName = firstName || fullName.split(" ")[0] || "friend";

    /* ----------------------------------------
       Build CMS-safe Application object
       (Matches your Payload collection)
    ----------------------------------------- */

    const cmsPayload = {
      // === Personal Information ===
      fullName,
      preferredName: firstName || null,
      dateOfBirth: null,
      gender: "prefer-not", // valid: male | female | nonbinary | prefer-not
      phone: data.phone || "",
      email: data.email || "",
      address: null,

      // === Church & Community ===
      fwcMember: "interested", // valid: yes | attend | interested | other-church
      churchName: "",
      previousPrograms: "no", // valid: yes | no
      previousProgramsDescription: data.message ?? "",

      // === Program Interest ===
      phase: "unsure", // valid: restore | root | rise | release | unsure
      whyJoin: data.message ?? "",
      spiritualGoals: "",

      // === Availability ===
      preferredMeetingTime: "any", // valid: weeknights | saturday | sunday | any
      meetingFrequency: "unsure", // valid: weekly | biweekly | monthly | unsure

      // === Support Needs ===
      supportNeeds: [] as string[],
      otherSupport: "",

      // === Commitment ===
      agreement: true,
      signature: fullName, // required
      signatureDate: new Date().toISOString(),

      // === Admin ===
      status: "pending",
      adminNotes: "",
    };

    /* ----------------------------------------
       0. Login to CMS (server user)
    ----------------------------------------- */

    const loginRes = await fetch(`${CMS_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.CMS_SERVER_USER_EMAIL,
        password: process.env.CMS_SERVER_USER_PASSWORD,
      }),
    });

    if (!loginRes.ok) {
      console.error("CMS LOGIN FAILED:", await loginRes.text());
      return NextResponse.json({ error: "CMS login failed" }, { status: 500 });
    }

    const { token } = await loginRes.json();

    /* ----------------------------------------
       1. Create Application in CMS
    ----------------------------------------- */

    const cmsRes = await fetch(`${CMS_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cmsPayload),
    });

    if (!cmsRes.ok) {
      const errorText = await cmsRes.text();
      console.error("CMS CREATE ERROR:", errorText);
      return NextResponse.json(
        { error: "CMS create failed", details: errorText },
        { status: 500 }
      );
    }

    /* ----------------------------------------
       2. Send Admin Email
    ----------------------------------------- */

    await resend.emails.send({
      from: "Pathways <pathways@freedomwc.org>",
      to: ADMIN_EMAIL,
      subject: "New Pathways Application Submitted",
      html: `
        <h2>New Pathways Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${data.email || ""}</p>
        <p><strong>Phone:</strong> ${data.phone || ""}</p>
        <p><strong>Message:</strong><br/>${data.message ?? "None"}</p>
      `,
    });

    /* ----------------------------------------
       3. Confirmation email to applicant
    ----------------------------------------- */

    await resend.emails.send({
      from: "Pathways <pathways@freedomwc.org>",
      to: data.email,
      subject: "We received your Pathways application",
      html: `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="color:#10152a; margin-bottom: 0.5rem;">
            Hey ${safeFirstName},
          </h2>
          <p>
            Thank you for taking the step to apply for <strong>Pathways</strong>.
          </p>
          <p>
            We’ve received your application and our team will review it prayerfully.
            Someone from <strong>Freedom Worship Center</strong> will follow up with you soon
            with next steps and details about your cohort, schedule, and what to expect.
          </p>
          <p>
            In the meantime, we invite you to keep praying into this journey.
            Pathways is designed to help you:
          </p>
          <ul>
            <li>Honor your story and where you’ve come from</li>
            <li>Heal and grow in emotional and spiritual health</li>
            <li>Discover and live out your God-given purpose</li>
          </ul>
          <p style="margin-top: 1rem;">
            If you have any questions, you can reply directly to this email.
          </p>
          <p style="margin-top: 1.5rem;">
            With grace and expectation,<br/>
            <strong>The Pathways Team</strong><br/>
            Freedom Worship Center
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
