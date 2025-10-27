import prisma from "../config/prismaClient.js";
// import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import main from "../config/AiGemini.js";

// ✅ Create Post (with optional image)
// helper to notify a specific user
const notifyUser = (req, userId, payload) => {
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");
  const socketId = connectedUsers.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("post:notification", payload);
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, tags, category } = req.body; // <-- add category
    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    // let uploadResult = null;

    // if image uploaded (using multer)
    // if (req.file) {
    //   uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "kb-posts",
    //   });
    //   fs.unlinkSync(req.file.path); // remove local temp file
    // }

    const post = await prisma.kBPost.create({
      data: {
        title,
        content,
        tags: tags
          ? Array.isArray(tags)
            ? tags.join(",")
            : tags.toString()
          : null,
        category: category || null, // <-- add category here
        // imageUrl: uploadResult?.secure_url || null,
        // imagePublicId: uploadResult?.public_id || null,
        authorId: req.user.id,
        status: "REVIEW",
      },
    });

    res.status(201).json({ message: "Post submitted for review", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};
export const updatePostByUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, content, tags, category } = req.body;
    const post = await prisma.kBPost.findUnique({ where: { id } });

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.canEdit)
      return res.status(403).json({ message: "Edit not allowed" });

    // let uploadResult = null;
    // if (req.file) {
    //   uploadResult = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "kb-posts",
    //   });
    //   fs.unlinkSync(req.file.path);
    // }

    await prisma.kBPost.update({
      where: { id },
      data: {
        title,
        content,
        tags: tags ? (Array.isArray(tags) ? tags.join(",") : tags) : null,
        category: category || null,
        // imageUrl: uploadResult?.secure_url || post.imageUrl,
        // imagePublicId: uploadResult?.public_id || post.imagePublicId,
        status: "REVIEW", // resubmit for review
        rejectReason: null, // reset reason
        canEdit: false, // reset edit permission until next rejection
      },
    });

    res.json({ message: "Post updated & submitted for review", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating post", success: false });
  }
};
// ✅ Get Published Posts with optional filters
export const getPublishedPosts = async (req, res) => {
  try {
    const { category, search } = req.query;

    // console.log("Backend query params:", { category, search });

    const whereClause = {
      status: "PUBLISHED",
      ...(category && category !== "All" ? { category } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } }, // case-insensitive if MySQL/SQLite varchar
              { tags: { contains: search } },
            ],
          }
        : {}),
    };

    const posts = await prisma.kBPost.findMany({
      where: whereClause,
      include: { author: true },
      orderBy: { publishedAt: "desc" },
    });

    // Map the result to send only necessary fields
    const result = posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      tags: p.tags ? p.tags.split(",") : [],
      // imageUrl: p.imageUrl,
      category: p.category,
      author: `${p.author.firstName} ${p.author.lastName}`,
      publishedAt: p.publishedAt,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// ✅ Get single KB post by ID
export const getKBPostById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await prisma.kBPost.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!post || post.status !== "PUBLISHED") {
      return res
        .status(404)
        .json({ message: "Post not found or not published", success: false });
    }

    const result = {
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.split(",") : [],
      category: post.category || null, // <-- include category
      // imageUrl: post.imageUrl,
      author: `${post.author.firstName} ${post.author.lastName}`,
      publishedAt: post.publishedAt,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching post", success: false });
  }
};

// ✅ Admin: List posts under review
export const listReviewPosts = async (req, res) => {
  try {
    const posts = await prisma.kBPost.findMany({
      where: { status: "REVIEW" },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    const result = posts.map((p) => ({
      ...p,
      category: p.category || null, // <-- include category
      tags: p.tags ? p.tags.split(",") : [],
      author: `${p.author.firstName} ${p.author.lastName}`,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error listing review posts", success: false });
  }
};

// ✅ Admin: Publish post
export const publishPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await prisma.kBPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    await prisma.kBPost.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    // Notify author
    notifyUser(req, post.authorId, {
      userId: post.authorId,
      postId: post.id,
      title: post.title,
      action: "PUBLISHED",
    });

    res.json({ message: "Post published", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error publishing post", success: false });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    // ✅ Ensure user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // ✅ Convert to int if your Prisma model uses Int
    const userId = Number(req.user.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // console.log("Fetching posts for user ID:", userId); // debug log

    // ✅ Query posts
    const posts = await prisma.kBPost.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    // console.log("Fetched posts:", posts);

    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("Error in getPostsByUser:", err);
    res.status(500).json({ message: "Error fetching post", success: false });
  }
};

// ✅ Admin: Reject post
// export const rejectPost = async (req, res) => {
//   try {
//     const id = parseInt(req.params.id, 10);
//     const { reason } = req.body;
//     const post = await prisma.kBPost.findUnique({ where: { id } });
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     await prisma.kBPost.update({
//       where: { id },
//       data: { status: "REJECTED" },
//     });

//     res.json({ message: "Post rejected" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error rejecting post" });
//   }
// };
export const rejectPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reason } = req.body;
    const post = await prisma.kBPost.findUnique({ where: { id } });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    await prisma.kBPost.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectReason: reason,
        canEdit: true, // user can now edit
      },
    });
    // Notify author
    notifyUser(req, post.authorId, {
      userId: post.authorId,
      postId: post.id,
      title: post.title,
      action: "REJECTED",
      reason,
    });

    res.json({ message: "Post rejected with reason", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting post", success: false });
  }
};

// ✅ Admin/User: Delete post (remove from Cloudinary)
export const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const post = await prisma.kBPost.findUnique({ where: { id } });
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // if (post.imagePublicId) {
    //   await cloudinary.uploader.destroy(post.imagePublicId);
    // }

    await prisma.kBPost.delete({ where: { id } });
    // Notify author
    notifyUser(req, post.authorId, {
      userId: post.authorId,
      postId: post.id,
      title: post.title,
      action: "DELETED",
    });
    res.json({ message: "Post deleted successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting post" });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate a blog content for this topic in simple text format"
    );
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};

// near the top with imports
// import prisma from "../config/prismaClient.js";
// (you already have notifyUser helper defined)

// Create an update request (user)
export const createUpdateRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId, reason } = req.body;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!postId) return res.status(400).json({ message: "postId required" });

    // ensure the post exists and belongs to the user and is published
    const post = await prisma.kBPost.findUnique({
      where: { id: Number(postId) },
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId)
      return res.status(403).json({ message: "You don't own this post" });
    if (post.status !== "PUBLISHED")
      return res
        .status(400)
        .json({ message: "Only published posts can request edit" });

    // prevent duplicate pending request for same post by same user
    const existing = await prisma.updateRequest.findFirst({
      where: { postId: post.id, userId, status: "PENDING" },
    });
    if (existing)
      return res
        .status(409)
        .json({ message: "A pending request already exists" });

    const reqEntry = await prisma.updateRequest.create({
      data: {
        postId: post.id,
        userId,
        reason: reason || null,
      },
    });

    // Notify admins (emit an 'admin:update-request' global event) — admin clients can listen
    const io = req.app.get("io");
    io?.emit("admin:update-request", {
      id: reqEntry.id,
      postId: post.id,
      title: post.title,
      userId,
      reason: reqEntry.reason,
    });

    return res
      .status(201)
      .json({ message: "Update request created", request: reqEntry });
  } catch (err) {
    console.error("createUpdateRequest:", err);
    return res.status(500).json({ message: "Error creating update request" });
  }
};

// Get all update requests (admin)
export const listUpdateRequests = async (req, res) => {
  try {
    const requests = await prisma.updateRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true, authorId: true } },
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
    res.json({ requests });
  } catch (err) {
    console.error("listUpdateRequests:", err);
    res.status(500).json({ message: "Error fetching update requests" });
  }
};

// Admin approve/reject request
export const actionUpdateRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { action, adminNote } = req.body; // action: 'approve' | 'reject'
    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ message: "Invalid action" });

    const reqEntry = await prisma.updateRequest.findUnique({ where: { id } });
    if (!reqEntry)
      return res.status(404).json({ message: "Request not found" });

    if (reqEntry.status !== "PENDING")
      return res.status(400).json({ message: "Request already processed" });

    if (action === "approve") {
      // set canEdit true on the post so user can edit
      await prisma.kBPost.update({
        where: { id: reqEntry.postId },
        data: { canEdit: true },
      });
      await prisma.updateRequest.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote || null },
      });

      // notify the user
      notifyUser(req, reqEntry.userId, {
        updateRequestId: id,
        postId: reqEntry.postId,
        action: "APPROVED",
        title: "Edit access granted",
      });

      return res.json({ message: "Request approved" });
    } else {
      // rejected
      await prisma.updateRequest.update({
        where: { id },
        data: { status: "REJECTED", adminNote: adminNote || null },
      });

      // notify the user
      notifyUser(req, reqEntry.userId, {
        updateRequestId: id,
        postId: reqEntry.postId,
        action: "REJECTED",
        title: "Edit request rejected",
        reason: adminNote || null,
      });

      return res.json({ message: "Request rejected" });
    }
  } catch (err) {
    console.error("actionUpdateRequest:", err);
    res.status(500).json({ message: "Error processing request" });
  }
};

// Get current user's requests
export const getMyUpdateRequests = async (req, res) => {
  try {
    const userId = Number(req.user?.id);
    const requests = await prisma.updateRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { post: { select: { id: true, title: true } } },
    });
    res.json({ requests });
  } catch (err) {
    console.error("getMyUpdateRequests:", err);
    res.status(500).json({ message: "Error fetching your requests" });
  }
};
