import { Resend } from "resend";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = "PrintOnline.et <order@printonline.et>";

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Skipping email send:", { to, subject });
    return false;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend API error:", error);
      return false;
    }

    console.log("[email] Sent successfully:", data?.id);
    return true;
  } catch (error) {
    console.error("[email] Failed to send email:", error);
    return false;
  }
}
