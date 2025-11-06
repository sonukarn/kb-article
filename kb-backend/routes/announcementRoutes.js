// routes/announcementRoutes.js
import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  dismissAnnouncement,
} from "../controllers/announcementController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// Public: anyone can view current announcements
router.get("/", getAnnouncements);

// Admin-only routes
router.post("/", requireAuth, requireRole("ADMIN"), createAnnouncement);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateAnnouncement);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteAnnouncement);

// Authenticated users can dismiss
router.post("/:id/dismiss", requireAuth, dismissAnnouncement);

export default router;
