const EMAIL_USER = process.env.EMAIL_USER || 'kumarabhineet409@gmail.com';
const EMAIL_API_URL = process.env.EMAIL_API_URL || 'https://api.brevo.com/v3/smtp/email'; // Default to Brevo API
const EMAIL_API_KEY = process.env.EMAIL_API_KEY || ''; // Add your Brevo or Email API Key here

const sendEmailViaAPI = async (to: string, subject: string, html: string) => {
  if (!EMAIL_API_KEY) {
    console.error('Missing EMAIL_API_KEY in environment variables. Email sending aborted.');
    return false;
  }

  try {
    // Assuming Brevo (Sendinblue) API format for the payload as it's a popular free choice
    // If using a different provider (like Resend, SendGrid), adjust the payload body and headers accordingly.
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': EMAIL_API_KEY, // Brevo uses 'api-key'. Resend uses 'Authorization: Bearer ...'
        // 'Authorization': `Bearer ${EMAIL_API_KEY}`, // Uncomment if using Resend/Sendgrid
      },
      body: JSON.stringify({
        sender: { name: 'SkillRelay', email: EMAIL_USER },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        // For Resend:
        // from: `SkillRelay <${EMAIL_USER}>`,
        // to: [to],
        // subject: subject,
        // html: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Email API Error:', response.status, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Fetch error when sending email:', error);
    return false;
  }
};

export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  technicianEmail: string,
  bookingDetails: {
    customerName: string;
    technicianName: string;
    skill: string;
    cost: string;
    distance: string;
    bookingId: string;
  }
) => {
  const { customerName, technicianName, skill, cost, distance, bookingId } = bookingDetails;

  const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">SkillRelay</h1>
          <p style="color:#9ca3af;margin:4px 0 0;font-size:13px;">Your trusted repair partner</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Booking Confirmed!</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi <strong>${customerName}</strong>, your service request has been accepted.</p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Booking ID</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${bookingId}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Service</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${skill}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Technician</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${technicianName}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Estimated Cost</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${cost}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;">Distance</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;text-align:right;">${distance}</td>
              </tr>
            </table>
          </div>

          <a href="http://localhost:5173/profile" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View My Orders</a>

          <p style="color:#9ca3af;font-size:12px;margin-top:32px;border-top:1px solid #f3f4f6;padding-top:16px;">
            &copy; 2026 SkillRelay - You received this because you made a booking
          </p>
        </div>
      </div>
    `;

  const techHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">SkillRelay</h1>
          <p style="color:#9ca3af;margin:4px 0 0;font-size:13px;">Technician Portal</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">New Booking Request!</h2>
          <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi <strong>${technicianName}</strong>, a customer has requested your services. Please review and confirm.</p>

          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Booking ID</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${bookingId}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Customer Email</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Service Required</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${skill}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;border-bottom:1px solid #e5e7eb;">Estimated Cost</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${cost}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:8px 0;">Distance from Customer</td>
                <td style="color:#111827;font-size:13px;font-weight:600;padding:8px 0;text-align:right;">${distance}</td>
              </tr>
            </table>
          </div>

          <a href="http://localhost:5173/technician/dashboard" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">Accept on Dashboard</a>

          <p style="color:#9ca3af;font-size:12px;margin-top:32px;border-top:1px solid #f3f4f6;padding-top:16px;">
            &copy; 2026 SkillRelay - You received this because you are a registered technician
          </p>
        </div>
      </div>
    `;

  const customerSuccess = await sendEmailViaAPI(customerEmail, \`Booking Confirmed - \${skill} | SkillRelay\`, customerHtml);
  if (customerSuccess) {
    console.log(\`Booking confirmation sent to customer: \${customerEmail}\`);
  }

  const techSuccess = await sendEmailViaAPI(technicianEmail, \`New Booking Request - \${skill} | SkillRelay\`, techHtml);
  if (techSuccess) {
    console.log(\`Booking request sent to technician: \${technicianEmail}\`);
  }

  return customerSuccess && techSuccess;
};

export const sendOTPEmail = async (toEmail: string, otp: string) => {
  const html = \`
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">SkillRelay</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <h2 style="color:#111827;">Verify your email</h2>
          <p style="color:#6b7280;">Use the code below to complete your registration. It expires in 30 minutes.</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#111827;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0;">\${otp}</div>
          <p style="color:#9ca3af;font-size:12px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    \`;

  const success = await sendEmailViaAPI(toEmail, 'Your Verification Code - SkillRelay', html);
  
  if (success) {
    console.log(\`OTP email sent successfully to: \${toEmail}\`);
    return true;
  } else {
    console.error('EMAIL FAILED TO SEND. OTP IS:', otp);
    return false;
  }
};



