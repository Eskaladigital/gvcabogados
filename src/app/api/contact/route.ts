import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, area, message, locale } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, log the contact form submission
    console.log('Contact form submission:', { name, phone, email, area, message, locale });

    // Optionally store in Supabase
    // const { createAdminClient } = await import('@/lib/supabase');
    // const supabase = createAdminClient();
    // await supabase.from('contact_submissions').insert({ name, phone, email, area, message, locale });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
