// src/utils/mailService.js
import { sendMail } from "./email.js";

export async function sendVerificationEmail(user, token) {
  const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}&id=${user.id}`;
  try {
    await sendMail({
      to: user.email,
      subject: "Verify your KB Articles account",
      html: `
        <p>Hi ${user.firstName},</p>
        <p>Please verify your email by clicking the link below (valid 24 hours):</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `,
    });
  } catch (err) {
    console.error("Verification email failed:", err);
  }
}

// export async function sendWelcomeEmail(user) {
//   try {
//     await sendMail({
//       to: user.email,
//       subject: "Welcome to KB Articles!",
//       html: `
//         <p>Hi ${user.firstName},</p>
//         <p>Welcome to <strong>KB Articles</strong>! 🎉</p>
//         <p>We are excited to have you on board. Start exploring our Kb Articles  and share your thoughts!</p>
//         <p>Cheers,<br/>The KB Articles Team</p>
//       `,
//     });
//   } catch (err) {
//     console.error("Welcome email failed:", err);
//   }
// }

export async function sendWelcomeEmail(user) {
  try {
    const currentYear = new Date().getFullYear();
    const portalName = "KB Articles";
    const portalLink = process.env.APP_URL || "https://kb-articles.com";
    const supportEmail = "support@kb-articles.com";

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to ${portalName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
      font-size: 26px;
      font-weight: bold;
      color: #0078D4;
      letter-spacing: 1px;
    }
    .content h1 {
      color: #333333;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .content p {
      color: #555555;
      line-height: 1.6;
      margin: 8px 0;
    }
    ul {
      color: #555555;
      line-height: 1.6;
      padding-left: 20px;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background-color: #0078D4;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #999999;
      text-align: center;
      line-height: 1.5;
    }
    a {
      color: #0078D4;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${portalName}</div>
    <div class="content">
      <h1>Welcome to ${portalName}! 🎉</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for joining <strong>${portalName}</strong>. We're thrilled to have you in our knowledge-sharing community!</p>
      <p>Here’s what you can do starting today:</p>
      <ul>
        <li>📘 Explore a wide range of helpful articles and tutorials</li>
        <li>🔍 Search by topic or keyword for quick answers</li>
        <li>💬 Share feedback and suggest new topics</li>
      </ul>
      <p>Click below to get started:</p>
      <a href="${portalLink}" class="button">Go to ${portalName}</a>
      <p style="margin-top: 16px;">
        If you have any questions, feel free to reach us at 
        <a href="mailto:${supportEmail}">${supportEmail}</a>.
      </p>
    </div>
    <div class="footer">
      &copy; ${currentYear} ${portalName}. All rights reserved.<br>
      <a href="${portalLink}">${portalLink}</a>
    </div>
  </div>
</body>
</html>
`;

    await sendMail({
      to: user.email,
      subject: `Welcome to ${portalName}!`,
      html,
    });

    console.log(`✅ Welcome email sent to ${user.email}`);
  } catch (err) {
    console.error("❌ Welcome email failed:", err);
  }
}
