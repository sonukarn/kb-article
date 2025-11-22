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
  getKBPostBySlug,
} from "../controllers/postController.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
// import { upload } from "../middlewares/upload.js";
const router = express.Router();

// router.post("/", requireAuth, createPost);
// router.get("/my-posts", requireAuth, getPostsByUser);
// router.get("/", getPublishedPosts);
// router.get("/:id", getKBPostById);
// // Add near other admin routes
// router.post("/update-requests", requireAuth, createUpdateRequest); // user create
// router.get("/update-requests/mine", requireAuth, getMyUpdateRequests); // user list their requests

// // Admin
// router.get(
//   "/admin/:id/view",
//   requireAuth,
//   requireRole("ADMIN"),
//   adminViewAllPosts
// );
// router.get(
//   "/admin/update-requests",
//   requireAuth,
//   requireRole("ADMIN"),
//   listUpdateRequests
// );
// router.patch(
//   "/admin/update-requests/:id",
//   requireAuth,
//   requireRole("ADMIN"),
//   actionUpdateRequest
// );

// router.get("/admin/review", requireAuth, requireRole("ADMIN"), listReviewPosts);
// router.patch(
//   "/admin/:id/publish",
//   requireAuth,
//   requireRole("ADMIN"),
//   publishPost
// );
// router.patch(
//   "/admin/:id/reject",
//   requireAuth,
//   requireRole("ADMIN"),
//   rejectPost
// );
// router.delete("/admin/:id", requireAuth, requireRole("ADMIN"), deletePost);
// router.patch("/:id", requireAuth, updatePostByUser);
// router.post("/generate", requireAuth, generateContent);
// Create
router.post("/", requireAuth, createPost);

// My posts
router.get("/my-posts", requireAuth, getPostsByUser);

// List published
router.get("/", getPublishedPosts);

// 👇 NEW: get post by slug (public KB)
router.get("/slug/:slug", getKBPostBySlug);

// Update-requests (user)
router.post("/update-requests", requireAuth, createUpdateRequest);
router.get("/update-requests/mine", requireAuth, getMyUpdateRequests);

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

// User update post by id
router.patch("/:id", requireAuth, updatePostByUser);

// AI generate
router.post("/generate", requireAuth, generateContent);

// Fallback: get by id (for admin / old links)
router.get("/:id", getKBPostById);

export default router;
