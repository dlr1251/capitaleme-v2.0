import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.RESEND_API_KEY) {
    return new Response('Missing RESEND_API_KEY', { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response('Unsupported content type', { status: 400 });
    }

    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const service = String(form.get('service') || '').trim();
    const message = String(form.get('message') || '').trim();
    const accepted = String(form.get('accepted') || '') === 'true';

    if (!name || !email || !phone || !message || !accepted) {
      return new Response('Validation error', { status: 400 });
    }

    const files = form.getAll('files');

    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    let totalBytes = 0;

    for (const file of files) {
      if (file instanceof File) {
        const buf = Buffer.from(await file.arrayBuffer());
        totalBytes += buf.byteLength;
        attachments.push({
          filename: file.name,
          content: buf,
          contentType: file.type || 'application/octet-stream'
        });
      }
    }

    if (totalBytes > 10 * 1024 * 1024) {
      return new Response('Attachments exceed 10MB', { status: 400 });
    }

    const htmlToTeam = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:#111827;">
        <h2 style="margin:0 0 16px;">New Contact Form Submission</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        ${service ? `<p style="margin:0 0 8px;"><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
        <div style="margin-top:16px; padding:12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px;">
          <div style="font-weight:600; margin-bottom:8px;">Message</div>
          <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    const htmlToUser = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color:#111827;">
        <h2 style="margin:0 0 16px;">We received your message</h2>
        <p style="margin:0 0 12px;">Hi ${escapeHtml(name)},</p>
        <p style="margin:0 0 12px;">Thanks for contacting Capital M Law. We've received your information and will reply within 24–48 hours.</p>
        <p style="margin:0 0 12px;">Here is a copy of your message:</p>
        <div style="margin-top:8px; padding:12px; background:#F9FAFB; border:1px solid #E5E7EB; border-radius:8px;">
          <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
        </div>
        <p style="margin:16px 0 0; font-size:12px; color:#6B7280;">If you didn't submit this request, you can ignore this email.</p>
      </div>
    `;

    await resend.emails.send({
      from: 'Capital M <no-reply@mail.capitaleme.com>',
      to: 'info@capitaleme.com',
      subject: 'New contact form submission',
      html: htmlToTeam,
      replyTo: email,
      attachments
    });

    await resend.emails.send({
      from: 'Capital M <no-reply@mail.capitaleme.com>',
      to: email,
      subject: 'We received your message - Capital M Law',
      html: htmlToUser,
      attachments
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    console.error('Contact API error', err);
    return new Response('Internal Server Error', { status: 500 });
  }
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


