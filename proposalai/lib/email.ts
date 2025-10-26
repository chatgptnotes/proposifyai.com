// Email Service Configuration
// Using Resend for email delivery

import { Resend } from 'resend';

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY || 'placeholder_for_build';
export const resend = new Resend(resendApiKey);

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'ProposalAI <proposals@proposalai.app>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@proposalai.app',
};

// Email templates
export const emailTemplates = {
  proposalSent: (data: {
    recipientName: string;
    proposalTitle: string;
    proposalUrl: string;
    senderName: string;
    customMessage?: string;
    expiresAt?: string;
  }) => ({
    subject: `New Proposal: ${data.proposalTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Proposal</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827;">ProposalAI</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Professional Proposals</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">Hello ${data.recipientName},</p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                ${data.senderName} has sent you a new proposal: <strong>${data.proposalTitle}</strong>
              </p>

              ${data.customMessage ? `
                <div style="margin: 0 0 24px; padding: 16px; background-color: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #4b5563; font-style: italic;">${data.customMessage}</p>
                </div>
              ` : ''}

              ${data.expiresAt ? `
                <p style="margin: 0 0 24px; font-size: 14px; color: #ef4444;">
                  ⚠️ This proposal expires on ${new Date(data.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.proposalUrl}" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      View Proposal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${data.proposalUrl}" style="color: #3b82f6; text-decoration: underline;">${data.proposalUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Sent via ProposalAI - Professional Proposal Management<br>
                <a href="https://proposalai.app" style="color: #3b82f6; text-decoration: none;">proposalai.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Tracking Pixel -->
  <img src="${data.proposalUrl}/track" width="1" height="1" style="display: block;" alt="" />
</body>
</html>
    `,
    text: `
Hello ${data.recipientName},

${data.senderName} has sent you a new proposal: ${data.proposalTitle}

${data.customMessage ? `\nMessage:\n${data.customMessage}\n` : ''}

${data.expiresAt ? `⚠️ This proposal expires on ${new Date(data.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n` : ''}

View your proposal here:
${data.proposalUrl}

---
Sent via ProposalAI - Professional Proposal Management
https://proposalai.app
    `,
  }),

  proposalAccepted: (data: {
    ownerName: string;
    proposalTitle: string;
    clientName: string;
    clientEmail: string;
    proposalUrl: string;
  }) => ({
    subject: `🎉 Proposal Accepted: ${data.proposalTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal Accepted</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 0; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
              <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Proposal Accepted!</h1>
              <p style="margin: 8px 0 24px; font-size: 14px; color: rgba(255,255,255,0.9);">Great news about your proposal</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">Hello ${data.ownerName},</p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                <strong>${data.clientName}</strong> has accepted your proposal: <strong>${data.proposalTitle}</strong>
              </p>

              <div style="margin: 0 0 24px; padding: 20px; background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: 600;">Client Details:</p>
                <p style="margin: 0; font-size: 14px; color: #166534;">
                  Name: ${data.clientName}<br>
                  Email: <a href="mailto:${data.clientEmail}" style="color: #166534; text-decoration: underline;">${data.clientEmail}</a>
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.proposalUrl}" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      View Proposal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">
                Next steps: Reach out to your client to finalize the details and begin the project.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Sent via ProposalAI - Professional Proposal Management<br>
                <a href="https://proposalai.app" style="color: #3b82f6; text-decoration: none;">proposalai.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
🎉 Proposal Accepted!

Hello ${data.ownerName},

${data.clientName} has accepted your proposal: ${data.proposalTitle}

Client Details:
Name: ${data.clientName}
Email: ${data.clientEmail}

View your proposal here:
${data.proposalUrl}

Next steps: Reach out to your client to finalize the details and begin the project.

---
Sent via ProposalAI - Professional Proposal Management
https://proposalai.app
    `,
  }),

  proposalRejected: (data: {
    ownerName: string;
    proposalTitle: string;
    clientName: string;
    clientEmail: string;
    reason?: string;
    proposalUrl: string;
  }) => ({
    subject: `Proposal Update: ${data.proposalTitle}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0;">
  <title>Proposal Rejected</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #111827;">ProposalAI</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Proposal Update</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151;">Hello ${data.ownerName},</p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151;">
                <strong>${data.clientName}</strong> has declined your proposal: <strong>${data.proposalTitle}</strong>
              </p>

              ${data.reason ? `
                <div style="margin: 0 0 24px; padding: 20px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;">
                  <p style="margin: 0 0 8px; font-size: 14px; color: #991b1b; font-weight: 600;">Reason provided:</p>
                  <p style="margin: 0; font-size: 14px; color: #991b1b;">${data.reason}</p>
                </div>
              ` : ''}

              <div style="margin: 0 0 24px; padding: 20px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #1e40af; font-weight: 600;">Client Details:</p>
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  Name: ${data.clientName}<br>
                  Email: <a href="mailto:${data.clientEmail}" style="color: #1e40af; text-decoration: underline;">${data.clientEmail}</a>
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.proposalUrl}" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      View Proposal
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280;">
                Don't be discouraged! Consider reaching out to understand their concerns and potentially revise your proposal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Sent via ProposalAI - Professional Proposal Management<br>
                <a href="https://proposalai.app" style="color: #3b82f6; text-decoration: none;">proposalai.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Proposal Update

Hello ${data.ownerName},

${data.clientName} has declined your proposal: ${data.proposalTitle}

${data.reason ? `Reason provided:\n${data.reason}\n\n` : ''}

Client Details:
Name: ${data.clientName}
Email: ${data.clientEmail}

View your proposal here:
${data.proposalUrl}

Don't be discouraged! Consider reaching out to understand their concerns and potentially revise your proposal.

---
Sent via ProposalAI - Professional Proposal Management
https://proposalai.app
    `,
  }),
};

// Helper to send emails
export async function sendEmail(data: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  try {
    const response = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: Array.isArray(data.to) ? data.to : [data.to],
      subject: data.subject,
      html: data.html,
      text: data.text,
      replyTo: data.replyTo || EMAIL_CONFIG.replyTo,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
