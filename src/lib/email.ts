/**
 * PetSaathi Email Notification Utility
 * Powered by Resend with fallback console logging.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "PetSaathi <onboarding@resend.dev>";

interface BookingConfirmationParams {
  to: string;
  customerName: string;
  referenceId: string;
  serviceType: string;
  date: string;
  amount: number;
}

interface SitterAssignedParams {
  to: string;
  customerName: string;
  sitterName: string;
  referenceId: string;
}

interface ServiceReportParams {
  to: string;
  customerName: string;
  petName: string;
  reportSummary: string;
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!RESEND_API_KEY) {
      console.warn("[Email Service] No RESEND_API_KEY set. Logging email to console:");
      console.log(`To: ${to}\nSubject: ${subject}\n\n${html}`);
      return { success: true, data: { mock: true } };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn(
        `[Email Service] Resend API responded with status ${response.status}:`,
        data
      );
      // Fallback console log so notification is not lost
      console.log(`[Email Fallback Log] To: ${to} | Subject: ${subject}`);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log(`[Email Service] Email successfully sent to ${to}: ${data.id}`);
    return { success: true, data };
  } catch (err: any) {
    console.error("[Email Service] Error dispatching email:", err.message);
    console.log(`[Email Fallback Log] To: ${to} | Subject: ${subject}`);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Booking Confirmation Email
 */
export async function sendBookingConfirmationEmail({
  to,
  customerName,
  referenceId,
  serviceType,
  date,
  amount,
}: BookingConfirmationParams) {
  const subject = `Booking Confirmed: ${referenceId} - PetSaathi`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 15px; }
          .content { padding: 32px; }
          .badge { display: inline-block; background-color: #dbeafe; color: #1d4ed8; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
          .details-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; font-size: 14px; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #64748b; font-weight: 500; }
          .detail-value { color: #0f172a; font-weight: 700; }
          .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 PetSaathi Booking Confirmed</h1>
            <p>Your pet care reservation is officially locked in!</p>
          </div>
          <div class="content">
            <span class="badge">Reference ID: ${referenceId}</span>
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for trusting PetSaathi. Your payment has been received and your booking is confirmed.</p>
            
            <div class="details-card">
              <div class="detail-row">
                <span class="detail-label">Service Type</span>
                <span class="detail-value">${serviceType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Scheduled Date</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount Paid</span>
                <span class="detail-value">₹${amount.toLocaleString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #16a34a;">CONFIRMED</span>
              </div>
            </div>

            <p style="font-size: 14px; color: #475569;">Our concierge operations team is coordinating with your verified sitter. You will receive live updates right here in your dashboard.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetSaathi Technologies Pvt. Ltd. | Dedicated Care for Every Paw</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 2. Sitter Assigned Email
 */
export async function sendSitterAssignedEmail({
  to,
  customerName,
  sitterName,
  referenceId,
}: SitterAssignedParams) {
  const subject = `Sitter Assigned: ${sitterName} will care for your pet! - PetSaathi`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 32px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 15px; }
          .content { padding: 32px; }
          .badge { display: inline-block; background-color: #d1fae5; color: #047857; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
          .sitter-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .sitter-name { font-size: 20px; font-weight: 800; color: #065f46; margin: 5px 0; }
          .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🤝 Your Sitter is Assigned!</h1>
            <p>Verified, background-checked pet companion assigned</p>
          </div>
          <div class="content">
            <span class="badge">Booking: ${referenceId}</span>
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Great news! We have assigned a verified PetSaathi sitter to fulfill your booking.</p>
            
            <div class="sitter-box">
              <div style="font-size: 32px;">🛡️</div>
              <div class="sitter-name">${sitterName}</div>
              <p style="margin: 4px 0 0; font-size: 13px; color: #047857; font-weight: 600;">L2/L3 Certified Sitter • Pet First Aid Trained</p>
            </div>

            <p style="font-size: 14px; color: #475569;">Your sitter will follow all specific walking, feeding, and care instructions provided in your pet profile.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetSaathi Technologies Pvt. Ltd. | Dedicated Care for Every Paw</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 3. Service Report Card Email
 */
export async function sendServiceReportEmail({
  to,
  customerName,
  petName,
  reportSummary,
}: ServiceReportParams) {
  const subject = `Walk Report Card for ${petName} is ready! 🐶 - PetSaathi`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 32px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0; opacity: 0.9; font-size: 15px; }
          .content { padding: 32px; }
          .report-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 24px; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Walk & Care Report Card</h1>
            <p>Here is how ${petName}'s session went!</p>
          </div>
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Your PetSaathi sitter has finished the service and submitted the session report card for <strong>${petName}</strong>.</p>
            
            <div class="report-box">
              <h3 style="margin-top: 0; color: #581c87; font-size: 16px; font-weight: 700;">Summary & Highlights</h3>
              <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155; margin: 0;">${reportSummary}</p>
            </div>

            <p style="font-size: 14px; color: #475569;">You can view the full activity details and leave a review for your sitter in your PetSaathi dashboard.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PetSaathi Technologies Pvt. Ltd. | Dedicated Care for Every Paw</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}
