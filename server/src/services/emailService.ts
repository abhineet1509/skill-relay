import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER || 'kumarabhineet409@gmail.com',
    pass: process.env.EMAIL_PASS || 'jgwe ovea cdfd lqwe'
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP CONNECTION ERROR (Render is likely blocking port 465 or invalid password):', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

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

  const customerMail = {
    from: `"SkillRelay" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Confirmed - ${skill} | SkillRelay`,
    html: `
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
    `
  };

  const techMail = {
    from: `"SkillRelay" <${process.env.EMAIL_USER}>`,
    to: technicianEmail,
    subject: `New Booking Request - ${skill} | SkillRelay`,
    html: `
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
    `
  };

  try {
    await transporter.sendMail(customerMail);
    console.log(`Booking confirmation sent to customer: ${customerEmail}`);
    await transporter.sendMail(techMail);
    console.log(`Booking request sent to technician: ${technicianEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking emails:', error);
    return false;
  }
};

export const sendOTPEmail = async (toEmail: string, otp: string) => {
  const mailOptions = {
    from: `"SkillRelay" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Verification Code - SkillRelay',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <div style="background:#111827;padding:24px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;">SkillRelay</h1>
        </div>
        <div style="padding:32px;text-align:center;">
          <h2 style="color:#111827;">Verify your email</h2>
          <p style="color:#6b7280;">Use the code below to complete your registration. It expires in 30 minutes.</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#111827;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:24px 0;">${otp}</div>
          <p style="color:#9ca3af;font-size:12px;">If you did not request this, ignore this email.</p>
        </div>
      </div>
    `
  };

  try {
    try { await transporter.sendMail(mailOptions); } catch (err) { console.error('EMAIL FAILED TO SEND. OTP IS:', otp, err); }
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
};


