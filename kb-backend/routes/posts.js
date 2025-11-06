import express from "express";
import {
  createPost,
  getPublishedPosts,
  listReviewPosts,
  publishPost,
  rejectPost,
  deletePost,
  getKBPostById,
  generateContent,
  updatePostByUser,
  getPostsByUser,
  createUpdateRequest,
  getMyUpdateRequests,
  listUpdateRequests,
  actionUpdateRequest,
  adminViewAllPosts,
} from "../controllers/postController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
// import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", requireAuth, createPost);
router.get("/my-posts", requireAuth, getPostsByUser);
router.get("/", getPublishedPosts);
router.get("/:id", getKBPostById);
// Add near other admin routes
router.post("/update-requests", requireAuth, createUpdateRequest); // user create
router.get("/update-requests/mine", requireAuth, getMyUpdateRequests); // user list their requests

// Admin
router.get(
  "/admin/:id/view",
  requireAuth,
  requireRole("ADMIN"),
  adminViewAllPosts
);
router.get(
  "/admin/update-requests",
  requireAuth,
  requireRole("ADMIN"),
  listUpdateRequests
);
router.patch(
  "/admin/update-requests/:id",
  requireAuth,
  requireRole("ADMIN"),
  actionUpdateRequest
);

router.get("/admin/review", requireAuth, requireRole("ADMIN"), listReviewPosts);
router.patch(
  "/admin/:id/publish",
  requireAuth,
  requireRole("ADMIN"),
  publishPost
);
router.patch(
  "/admin/:id/reject",
  requireAuth,
  requireRole("ADMIN"),
  rejectPost
);
router.delete("/admin/:id", requireAuth, requireRole("ADMIN"), deletePost);
router.patch("/:id", requireAuth, updatePostByUser);
router.post("/generate", requireAuth, generateContent);

export default router;
