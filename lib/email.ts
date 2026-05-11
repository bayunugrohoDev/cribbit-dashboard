import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Create a reusable transporter using SMTP settings
const smtpOptions = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
    ...data,
  });
};

export const sendAgentWelcomeEmail = async (
  email: string,
  name: string,
  plainPassword: string
) => {
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-xl; margin: 0 auto; color: #1a1d14;">
      <h2 style="color: #345ca8;">Welcome to Cribbit, ${name}!</h2>
      <p>Your application to join the Cribbit Real Estate Network has been officially <strong>approved</strong>.</p>
      
      <div style="background-color: #fafaec; padding: 20px; border-radius: 8px; margin: 24px 0; border: 1px solid #e8e9db;">
        <h3 style="margin-top: 0; font-size: 16px;">Your Access Credentials</h3>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0;"><strong>Temporary Password:</strong> <code style="background: #e2e4d6; padding: 2px 6px; border-radius: 4px;">${plainPassword}</code></p>
      </div>

      <p>Please log in to your dashboard using the temporary password above. We highly recommend changing your password immediately upon logging in for security purposes.</p>
      
      <a href="https://cribbit-dashboard-shadcn.vercel.app/login" style="display: inline-block; padding: 12px 24px; background-color: #1a1d14; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: bold; margin-top: 16px;">
        Login to Dashboard
      </a>

      <hr style="border: none; border-top: 1px solid #e8e9db; margin: 32px 0;" />
      <p style="font-size: 12px; color: #747782;">
        If you did not request this, please ignore this email.<br>
        &copy; 2024 Cribbit Realty Group.
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Your Cribbit Agent Account is Approved - Welcome Aboard!",
    html,
  });
};
