import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // Initialize Resend inside the handler to avoid build-time errors
  const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build');
  try {
    // Get the user from the session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { proposalId, recipientEmail, recipientName, subject, message, proposalLink, pdfAttachment } = body;

    // Validate required fields
    if (!recipientEmail || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientEmail, subject' },
        { status: 400 }
      );
    }

    // Get user profile for sender info
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, company_name, email')
      .eq('id', user.id)
      .single();

    const senderName = profile?.full_name || 'ProposifyAI User';
    const senderCompany = profile?.company_name || '';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@proposifyai.com';

    // Create email HTML template
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 30px;
      border-radius: 12px 12px 0 0;
      text-align: center;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .message {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #4f46e5;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      border-radius: 0 0 12px 12px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px;">New Proposal from ${senderName}</h1>
    ${senderCompany ? `<p style="margin: 10px 0 0 0; opacity: 0.9;">${senderCompany}</p>` : ''}
  </div>

  <div class="content">
    <p>Dear ${recipientName || 'Valued Client'},</p>

    <div class="message">
      ${message || 'We are pleased to share our proposal with you. Please review the attached document at your convenience.'}
    </div>

    ${proposalLink ? `
    <div style="text-align: center;">
      <a href="${proposalLink}" class="cta-button">View Proposal Online</a>
    </div>
    ` : ''}

    <p style="margin-top: 30px;">
      If you have any questions or would like to discuss this proposal further, please don't hesitate to reach out.
    </p>

    <p style="margin-top: 20px;">
      Best regards,<br>
      <strong>${senderName}</strong><br>
      ${senderCompany ? `${senderCompany}<br>` : ''}
      ${profile?.email || ''}
    </p>
  </div>

  <div class="footer">
    <p style="margin: 0;">
      This proposal was created and sent using <a href="https://proposifyai.com">ProposifyAI</a>
    </p>
    <p style="margin: 10px 0 0 0; font-size: 12px;">
      &copy; ${new Date().getFullYear()} ProposifyAI. All rights reserved.
    </p>
  </div>
</body>
</html>
    `;

    // Prepare email data
    const emailData: any = {
      from: `${senderName} <${fromEmail}>`,
      to: recipientEmail,
      subject,
      html: emailHTML,
      replyTo: profile?.email || fromEmail,
    };

    // Add PDF attachment if provided
    if (pdfAttachment) {
      emailData.attachments = [
        {
          filename: pdfAttachment.filename || 'proposal.pdf',
          content: pdfAttachment.content, // Base64 encoded PDF
        },
      ];
    }

    // Send email using Resend
    const { data: emailResult, error: emailError } = await resend.emails.send(emailData);

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError },
        { status: 500 }
      );
    }

    // Update proposal status if proposalId is provided
    if (proposalId) {
      await supabase
        .from('proposals')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', proposalId)
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: emailResult?.id,
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
