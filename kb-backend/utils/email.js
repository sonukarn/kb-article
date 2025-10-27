// src/utils/email.js
import nodemailer from "nodemailer";
let smtpPass = process.env.SMTP_PASS_B64
  ? Buffer.from(process.env.SMTP_PASS_B64, "base64").toString("utf8")
  : process.env.SMTP_PASS;
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: smtpPass,
  },
});

async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return info;
}

export { sendMail };
