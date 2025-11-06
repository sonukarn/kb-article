// src/utils/tokens.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30",
  10
);

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

// refresh token is a random string. We'll store a hashed version in DB.
function generateRefreshTokenRaw() {
  return crypto.randomBytes(64).toString("hex"); // send raw in cookie
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function refreshTokenExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_EXPIRES_DAYS);
  return d;
}

export {
  signAccessToken,
  verifyAccessToken,
  generateRefreshTokenRaw,
  hashToken,
  refreshTokenExpiryDate,
};
