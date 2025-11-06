// src/routes/auth.js
import express from "express";
import { body } from "express-validator";
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("password").isLength({ min: 6 }),
  register
);

router.get("/verify-email", verifyEmail);

router.post("/login", login);

router.get("/refresh", refresh);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
