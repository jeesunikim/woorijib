import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, body, userEmail } = await req.json();

    if (!to || !subject || !body) {
      return Response.json(
        { error: "Missing required fields: to, subject, body" },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: "WooriJib <noreply@woorijib.com>",
      to,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f9f5f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              <strong>From:</strong> ${userEmail}
            </p>
          </div>
          <div style="color: #333; line-height: 1.6;">
            ${body.split("\n").map((line: string) => `<p>${line}</p>`).join("")}
          </div>
          <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; color: #999; font-size: 12px;">
            <p>This email was drafted by WooriJib, an AI home diagnosis tool.</p>
          </div>
        </div>
      `,
      replyTo: userEmail,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return Response.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      messageId: result.data?.id,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
