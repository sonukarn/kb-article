import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
  adminDeleteUser,
  adminGetAllUsers,
  updateUserProfile,
} from "../controllers/userController.js";
// import { adminDeleteUser } from "../controllers/userController.js";
// import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();
router.get("/admin/all", requireAuth, requireRole("ADMIN"), adminGetAllUsers);
router.delete("/admin/:id", requireAuth, requireRole("ADMIN"), adminDeleteUser);
router.put("/me", requireAuth, updateUserProfile);

export default router;
