// // src/controllers/authController.js
// import bcrypt from "bcryptjs";
// import prisma from "../config/prismaClient.js";
// import { validationResult } from "express-validator";
// import {
//   signAccessToken,
//   verifyAccessToken,
//   generateRefreshTokenRaw,
//   hashToken,
//   refreshTokenExpiryDate,
// } from "../utils/tokens.js";
// import { sendMail } from "../utils/email.js";
// import crypto from "crypto";

// const COOKIE_OPTS = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
//   // path: '/', // default
// };

// const SALT_ROUNDS = 10;

// export const register = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty())
//     return res.status(422).json({ errors: errors.array() });

//   const { firstName, lastName, email, phone, password, confirmPassword } =
//     req.body;
//   if (password !== confirmPassword)
//     return res
//       .status(400)
//       .json({ message: "Passwords do not match", success: false });

//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing)
//     return res
//       .status(409)
//       .json({ message: "Email already registered", success: false });

//   const hashed = await bcrypt.hash(password, SALT_ROUNDS);

//   const user = await prisma.user.create({
//     data: {
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hashed,
//       role: "USER",
//     },
//   });

//   // create verification token (raw + hashed stored)
//   const rawToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(rawToken)
//     .digest("hex");
//   const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

//   await prisma.verificationToken.create({
//     data: {
//       token: hashedToken,
//       userId: user.id,
//       expiresAt,
//     },
//   });

//   const verificationLink = `${process.env.APP_URL}/verify-email?token=${rawToken}&id=${user.id}`;

//   // send email (ignore errors but log)
//   try {
//     await sendMail({
//       to: user.email,
//       subject: "Verify your KB Articles account",
//       text: "Verify your Email",
//       html: `<p>Hi ${user.firstName},</p>
//              <p>Please verify your email by clicking link below (valid 24 hours):</p>
//              <a href="${verificationLink}">${verificationLink}</a>`,
//     });
//   } catch (e) {
//     console.error("Email send error", e);
//   }

//   return res.status(201).json({
//     message: "User created. Please check email for verification.",
//     success: true,
//   });
// };

// export const verifyEmail = async (req, res) => {
//   const { token, id } = req.query;
//   if (!token || !id)
//     return res.status(400).json({ message: "Invalid request", success: false });

//   const hashed = crypto.createHash("sha256").update(token).digest("hex");
//   const record = await prisma.verificationToken.findFirst({
//     where: { token: hashed, userId: parseInt(id, 10) },
//   });
//   if (!record)
//     return res
//       .status(400)
//       .json({ message: "Invalid or expired token", success: false });
//   if (new Date() > record.expiresAt) {
//     await prisma.verificationToken.delete({ where: { id: record.id } });
//     return res.status(400).json({ message: "Token expired", success: false });
//   }

//   await prisma.user.update({
//     where: { id: parseInt(id, 10) },
//     data: { isVerified: true },
//   });
//   await prisma.verificationToken.delete({ where: { id: record.id } });

//   return res.json({
//     message: "Email verified. You can now log in.",
//     success: true,
//   });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user)
//     return res
//       .status(400)
//       .json({ message: "Invalid credentials", success: false });

//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok)
//     return res
//       .status(400)
//       .json({ message: "Invalid credentials", success: false });

//   if (!user.isVerified)
//     return res.status(403).json({
//       message: "Please verify your email before logging in",
//       success: false,
//     });

//   const accessToken = signAccessToken({ userId: user.id, role: user.role });
//   const refreshRaw = generateRefreshTokenRaw();
//   const refreshHashed = hashToken(refreshRaw);
//   const expiresAt = refreshTokenExpiryDate();

//   // save hashed refresh token
//   await prisma.refreshToken.create({
//     data: {
//       token: refreshHashed,
//       userId: user.id,
//       expiresAt,
//     },
//   });

//   // set cookies
//   res.cookie("accessToken", accessToken, {
//     ...COOKIE_OPTS,
//     maxAge: 15 * 60 * 1000,
//   }); // 15 min
//   res.cookie("refreshToken", refreshRaw, {
//     ...COOKIE_OPTS,
//     maxAge: expiresAt.getTime() - Date.now(),
//   });

//   // return user basic info
//   return res.json({
//     message: "Logged in",
//     user: {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       role: user.role,
//     },
//     success: true,
//   });
// };

// export const refresh = async (req, res) => {
//   try {
//     const refreshRaw = req.cookies?.refreshToken;
//     if (!refreshRaw)
//       return res
//         .status(401)
//         .json({ message: "No refresh token", success: false });
//     const hashed = hashToken(refreshRaw);

//     const record = await prisma.refreshToken.findFirst({
//       where: { token: hashed },
//       include: { user: true },
//     });
//     if (!record)
//       return res
//         .status(401)
//         .json({ message: "Invalid refresh token", success: false });
//     if (new Date() > record.expiresAt) {
//       await prisma.refreshToken.delete({ where: { id: record.id } });
//       return res
//         .status(401)
//         .json({ message: "Refresh token expired", success: false });
//     }

//     // rotate refresh token: delete old, create new
//     await prisma.refreshToken.delete({ where: { id: record.id } });
//     const newRaw = generateRefreshTokenRaw();
//     const newHashed = hashToken(newRaw);
//     const newExpires = refreshTokenExpiryDate();
//     await prisma.refreshToken.create({
//       data: { token: newHashed, userId: record.userId, expiresAt: newExpires },
//     });

//     const accessToken = signAccessToken({
//       userId: record.user.id,
//       role: record.user.role,
//     });

//     res.cookie("accessToken", accessToken, {
//       ...COOKIE_OPTS,
//       maxAge: 15 * 60 * 1000,
//     });
//     res.cookie("refreshToken", newRaw, {
//       ...COOKIE_OPTS,
//       maxAge: newExpires.getTime() - Date.now(),
//     });

//     return res.json({
//       message: "Refreshed",
//       success: true,
//       user: {
//         id: record.user.id,
//         firstName: record.user.firstName,
//         lastName: record.user.lastName,
//         email: record.user.email,
//         role: record.user.role,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(401)
//       .json({ message: "Could not refresh", success: false });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     const refreshRaw = req.cookies?.refreshToken;
//     if (refreshRaw) {
//       const hashed = hashToken(refreshRaw);
//       await prisma.refreshToken.deleteMany({ where: { token: hashed } });
//     }
//   } catch (e) {
//     console.error("logout cleanup error", e);
//   }

//   // clear cookies
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
//   return res.json({ message: "Logged out", success: true });
// };

// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   if (!email)
//     return res.status(400).json({ message: "Email required", success: false });
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user)
//     return res.status(200).json({
//       message: "If the email exists you will receive reset link",
//       success: false,
//     }); // do not reveal

//   // create reset token
//   const rawToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(rawToken)
//     .digest("hex");
//   const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

//   await prisma.passwordResetToken.create({
//     data: { token: hashedToken, userId: user.id, expiresAt },
//   });

//   const resetLink = `${process.env.APP_URL}/auth/reset-password?token=${rawToken}&id=${user.id}`;
//   try {
//     await sendMail({
//       to: user.email,
//       subject: "Reset your KB Articles password",
//       html: `<p>Use this link to reset password (valid 1 hour):</p><a href="${resetLink}">${resetLink}</a>`,
//     });
//   } catch (e) {
//     console.error("reset email failed", e);
//   }

//   return res.json({
//     message: "If the email exists you will receive reset link",
//     success: true,
//   });
// };

// export const resetPassword = async (req, res) => {
//   const { password, confirmPassword } = req.body;
//   const { token, id } = req.query;
//   if (!token || !id || !password || !confirmPassword)
//     return res.status(400).json({ message: "Missing fields", success: false });
//   if (password !== confirmPassword)
//     return res
//       .status(400)
//       .json({ message: "Passwords do not match", success: false });

//   const hashed = crypto.createHash("sha256").update(token).digest("hex");
//   const record = await prisma.passwordResetToken.findFirst({
//     where: { token: hashed, userId: parseInt(id, 10) },
//   });
//   if (!record)
//     return res
//       .status(400)
//       .json({ message: "Invalid or expired token", success: false });
//   if (new Date() > record.expiresAt) {
//     await prisma.passwordResetToken.delete({ where: { id: record.id } });
//     return res.status(400).json({ message: "Token expired" });
//   }

//   const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
//   await prisma.user.update({
//     where: { id: parseInt(id, 10) },
//     data: { password: hashedPassword },
//   });
//   await prisma.passwordResetToken.delete({ where: { id: record.id } });
//   return res.json({ message: "Password reset successful", success: true });
// };

import bcrypt from "bcryptjs";
import prisma from "../config/prismaClient.js";
import { validationResult } from "express-validator";
import crypto from "crypto";
import {
  signAccessToken,
  generateRefreshTokenRaw,
  hashToken,
  refreshTokenExpiryDate,
} from "../utils/tokens.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/mailService.js";
import { sendMail } from "../utils/email.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { firstName, lastName, email, phone, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ message: "Passwords do not match", success: false });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return res
      .status(409)
      .json({ message: "Email already registered", success: false });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { firstName, lastName, email, phone, password: hashed, role: "USER" },
  });

  // create verification token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  await prisma.verificationToken.create({
    data: { token: hashedToken, userId: user.id, expiresAt },
  });

  // send verification email
  await sendVerificationEmail(user, rawToken);

  return res.status(201).json({
    message: "User created. Please check email for verification.",
    success: true,
  });
};

export const verifyEmail = async (req, res) => {
  const { token, id } = req.query;
  if (!token || !id)
    return res.status(400).json({ message: "Invalid request", success: false });

  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.verificationToken.findFirst({
    where: { token: hashed, userId: parseInt(id, 10) },
  });
  if (!record)
    return res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });

  if (new Date() > record.expiresAt) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return res.status(400).json({ message: "Token expired", success: false });
  }

  const user = await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: { isVerified: true },
  });

  await prisma.verificationToken.delete({ where: { id: record.id } });

  // send welcome email after successful verification
  await sendWelcomeEmail(user);

  return res.json({
    message: "Email verified. You can now log in.",
    success: true,
  });
};

// ----- Login -----
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid credentials", success: false });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    return res
      .status(400)
      .json({ message: "Invalid credentials", success: false });

  if (!user.isVerified)
    return res.status(403).json({
      message: "Please verify your email before logging in",
      success: false,
    });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshRaw = generateRefreshTokenRaw();
  const refreshHashed = hashToken(refreshRaw);
  const expiresAt = refreshTokenExpiryDate();

  await prisma.refreshToken.create({
    data: { token: refreshHashed, userId: user.id, expiresAt },
  });

  res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTS,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshRaw, {
    ...COOKIE_OPTS,
    maxAge: expiresAt.getTime() - Date.now(),
  });

  return res.json({
    message: "Logged in",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    success: true,
  });
};

// ----- Refresh token -----
export const refresh = async (req, res) => {
  try {
    const refreshRaw = req.cookies?.refreshToken;
    if (!refreshRaw)
      return res
        .status(401)
        .json({ message: "No refresh token", success: false });

    const hashed = hashToken(refreshRaw);
    const record = await prisma.refreshToken.findFirst({
      where: { token: hashed },
      include: { user: true },
    });
    if (!record)
      return res
        .status(401)
        .json({ message: "Invalid refresh token", success: false });
    if (new Date() > record.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: record.id } });
      return res
        .status(401)
        .json({ message: "Refresh token expired", success: false });
    }

    // rotate token
    await prisma.refreshToken.delete({ where: { id: record.id } });
    const newRaw = generateRefreshTokenRaw();
    const newHashed = hashToken(newRaw);
    const newExpires = refreshTokenExpiryDate();
    await prisma.refreshToken.create({
      data: { token: newHashed, userId: record.userId, expiresAt: newExpires },
    });

    const accessToken = signAccessToken({
      userId: record.user.id,
      role: record.user.role,
    });
    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTS,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRaw, {
      ...COOKIE_OPTS,
      maxAge: newExpires.getTime() - Date.now(),
    });

    return res.json({ message: "Refreshed", success: true, user: record.user });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ message: "Could not refresh", success: false });
  }
};

// ----- Logout -----
export const logout = async (req, res) => {
  try {
    const refreshRaw = req.cookies?.refreshToken;
    if (refreshRaw)
      await prisma.refreshToken.deleteMany({
        where: { token: hashToken(refreshRaw) },
      });
  } catch (e) {
    console.error("logout cleanup error", e);
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out", success: true });
};

// ----- Forgot Password -----
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Email required", success: false });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(200).json({
      message: "If the email exists you will receive reset link",
      success: false,
    });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token: hashedToken, userId: user.id, expiresAt },
  });

  const resetLink = `${process.env.APP_URL}/reset-password?token=${rawToken}&id=${user.id}`;
  try {
    await sendMail({
      to: user.email,
      subject: "Reset your KB Articles password",
      html: `<p>Use this link to reset password (valid 1 hour):</p><a href="${resetLink}">${resetLink}</a>`,
    });
  } catch (e) {
    console.error("reset email failed", e);
  }

  return res.json({
    message: "If the email exists you will receive reset link",
    success: true,
  });
};

// ----- Reset Password -----
export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token, id } = req.query;

  if (!token || !id || !password || !confirmPassword)
    return res.status(400).json({ message: "Missing fields", success: false });
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ message: "Passwords do not match", success: false });

  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.passwordResetToken.findFirst({
    where: { token: hashed, userId: parseInt(id, 10) },
  });
  if (!record)
    return res
      .status(400)
      .json({ message: "Invalid or expired token", success: false });
  if (new Date() > record.expiresAt) {
    await prisma.passwordResetToken.delete({ where: { id: record.id } });
    return res.status(400).json({ message: "Token expired", success: false });
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: { password: hashedPassword },
  });
  await prisma.passwordResetToken.delete({ where: { id: record.id } });

  return res.json({ message: "Password reset successful", success: true });
};
