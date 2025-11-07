import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_HOUR = 5;

function getClientIP(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  // Fallback (won't work in production but useful for development)
  return 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_HOUR) {
    return false; // Rate limit exceeded
  }

  record.count++;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  if (!process.env.RESEND_API_KEY) {
    return new Response('Missing RESEND_API_KEY', { status: 500 });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response('Too many requests. Please try again later.', { status: 429 });
    }

    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response('Unsupported content type', { status: 400 });
    }

    const form = await request.formData();
    
    // Anti-spam validations
    // 1. Honeypot check
    const website = String(form.get('website') || '').trim();
    if (website) {
      console.warn('Bot detected via honeypot field');
      // Silently return success to not let bot know it was caught
      return new Response(JSON.stringify({ ok: true }), { 
        status: 200, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    // 2. Time-based validation
    const timeSpent = parseInt(String(form.get('timeSpent') || '0'));
    const minTime = 3000; // 3 seconds minimum
    if (timeSpent < minTime) {
      console.warn('Form submitted too quickly - possible bot');
      return new Response('Invalid form submission', { status: 400 });
    }

    // 3. Token validation
    const token = String(form.get('token') || '').trim();
    if (!token || token.length < 10) {
      console.warn('Missing or invalid form token');
      return new Response('Invalid form submission', { status: 400 });
    }

    // Extract form data
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const service = String(form.get('service') || '').trim();
    const message = String(form.get('message') || '').trim();
    const accepted = String(form.get('accepted') || '') === 'true';

    // Basic validation
    if (!name || !email || !phone || !message || !accepted) {
      return new Response('Validation error', { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response('Invalid email format', { status: 400 });
    }

    // Message length validation (prevent spam)
    if (message.length > 5000) {
      return new Response('Message is too long', { status: 400 });
    }

    // Check for suspicious patterns (common spam indicators)
    const spamPatterns = [
      /http[s]?:\/\/[^\s]+/gi, // URLs
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, // Multiple emails
    ];
    
    const messageLower = message.toLowerCase();
    const suspiciousWordCount = (messageLower.match(/\b(buy|sell|discount|cheap|free|click here|viagra|casino|loan|credit)\b/gi) || []).length;
    if (suspiciousWordCount > 3) {
      console.warn('Suspicious message content detected');
      return new Response('Invalid message content', { status: 400 });
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


