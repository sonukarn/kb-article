// src/routes/categoryRoutes.js
import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
  listCategories,
  createCategory,
  approveCategory,
  rejectCategory,
  renameCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Anyone (no auth) can list approved categories for dropdown
// If you want only approved by default on public, pass ?status=APPROVED from frontend
router.get("/", listCategories);

// User can suggest/create (PENDING)
router.post("/", requireAuth, createCategory);

// Admin actions
router.patch(
  "/:id/approve",
  requireAuth,
  requireRole("ADMIN"),
  approveCategory
);
router.patch("/:id/reject", requireAuth, requireRole("ADMIN"), rejectCategory);
router.patch("/:id", requireAuth, requireRole("ADMIN"), renameCategory);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCategory);

export default router;
