import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { name, email, message } = parsed.data;

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #171717; margin-bottom: 24px;">New Contact Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #525252; width: 80px;">Name:</td>
              <td style="padding: 8px 0; color: #171717;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #525252;">Email:</td>
              <td style="padding: 8px 0; color: #1a56db;">
                <a href="mailto:${email}">${email}</a>
              </td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f5f5f5; border-radius: 8px;">
            <p style="font-weight: 600; color: #525252; margin: 0 0 8px 0;">Message:</p>
            <p style="color: #171717; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}