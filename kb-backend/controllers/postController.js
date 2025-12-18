import prisma from "../config/prismaClient.js";
import fs from "fs";
import main from "../config/AiGemini.js";
import { generateShortSlug } from "../utils/generateSlug.js";
import cloudinary from "../config/cloudinary.js";
// helper to send notification
const notifyUser = (req, userId, payload) => {
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");
  const socketId = connectedUsers.get(userId?.toString());
  if (socketId) io.to(socketId).emit("post:notification", payload);
};

// ✅ Normalize category output anywhere
const formatCategory = (cat) => {
  if (!cat) return null;
  return {
    id: cat.id,
    name: cat.name,
    status: cat.status,
  };
};

// ✅ Resolve category on create/update
async function resolveCategoryOnCreate({
  categoryId,
  newCategoryName,
  userId,
}) {
  if (newCategoryName && newCategoryName.trim()) {
    const name = newCategoryName.trim();
    let cat = await prisma.category.findUnique({ where: { name } });
    if (!cat) {
      cat = await prisma.category.create({
        data: {
          name,
          status: "PENDING",
          createdBy: userId ?? null,
        },
      });
    }
    return cat.id;
  }

  if (categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });
    if (!cat) throw new Error("Selected category not found");
    if (cat.status !== "APPROVED") throw new Error("Category is not approved");
    return cat.id;
  }

  return null;
}

// images = [{ url, publicId }, ...] from frontend
const syncPostImages = async (postId, content, images = []) => {
  // normalize array
  const list = Array.isArray(images) ? images : [];

  // only keep images that actually appear in the content HTML
  const referenced = list.filter((img) => img.url && content.includes(img.url));

  // load existing records
  const existing = await prisma.postImage.findMany({
    where: { postId },
  });

  const byPublicId = (arr) => new Map(arr.map((img) => [img.publicId, img]));

  const existingMap = byPublicId(existing);
  const desiredMap = byPublicId(referenced);

  // 1) Delete images removed from content
  for (const oldImg of existing) {
    if (!desiredMap.has(oldImg.publicId)) {
      // delete from Cloudinary
      try {
        await cloudinary.uploader.destroy(oldImg.publicId);
      } catch (e) {
        console.error("Failed to delete Cloudinary image:", e.message);
      }
      // delete from DB
      await prisma.postImage.delete({
        where: { id: oldImg.id },
      });
    }
  }

  // 2) Add new images
  for (const img of referenced) {
    if (!existingMap.has(img.publicId)) {
      await prisma.postImage.create({
        data: {
          postId,
          url: img.url,
          publicId: img.publicId,
        },
      });
    }
  }
};

// ✅ Create Post

// export const createPost = async (req, res) => {
//   try {
//     const { title, content, tags, categoryId, newCategoryName } = req.body;

//     if (!title || !content)
//       return res.status(400).json({ message: "Title and content required" });

//     let resolvedCategoryId = null;
//     try {
//       resolvedCategoryId = await resolveCategoryOnCreate({
//         categoryId,
//         newCategoryName,
//         userId: req.user?.id,
//       });
//     } catch (e) {
//       return res.status(400).json({ message: e.message });
//     }

//     // 🔹 generate base slug from title
//     const baseSlug = generateShortSlug(title);

//     // 🔹 ensure unique in DB
//     let finalSlug = baseSlug;
//     const existing = await prisma.kBPost.findUnique({
//       where: { slug: finalSlug },
//     });
//     if (existing) {
//       finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
//     }

//     const post = await prisma.kBPost.create({
//       data: {
//         title,
//         slug: finalSlug, // 👈 SAVE SLUG
//         content,
//         tags: tags
//           ? Array.isArray(tags)
//             ? tags.join(",")
//             : tags.toString()
//           : null,
//         categoryId: resolvedCategoryId,
//         authorId: req.user.id,
//         status: "REVIEW",
//       },
//       include: { category: true },
//     });

//     res.status(201).json({
//       message: "Post submitted for review",
//       post: {
//         id: post.id,
//         slug: post.slug, // 👈 RETURN SLUG
//         title: post.title,
//         content: post.content,
//         tags: post.tags ? post.tags.split(",") : [],
//         status: post.status,
//         category: formatCategory(post.category),
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error creating post" });
//   }
// };
export const createPost = async (req, res) => {
  try {
    const { title, content, tags, categoryId, newCategoryName, contentImages } =
      req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content required" });

    let resolvedCategoryId = null;
    try {
      resolvedCategoryId = await resolveCategoryOnCreate({
        categoryId,
        newCategoryName,
        userId: req.user?.id,
      });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    const baseSlug = generateShortSlug(title);
    let finalSlug = baseSlug;
    const existing = await prisma.kBPost.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const post = await prisma.kBPost.create({
      data: {
        title,
        slug: finalSlug,
        content,
        tags: tags
          ? Array.isArray(tags)
            ? tags.join(",")
            : tags.toString()
          : null,
        categoryId: resolvedCategoryId,
        authorId: req.user.id,
        status: "REVIEW",
      },
      include: { category: true },
    });

    // 👇 sync images
    if (Array.isArray(contentImages) && contentImages.length) {
      await syncPostImages(post.id, content, contentImages);
    }

    res.status(201).json({
      message: "Post submitted for review",
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        tags: post.tags ? post.tags.split(",") : [],
        status: post.status,
        category: formatCategory(post.category),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};

// ✅ User update (re-submit for review)
// export const updatePostByUser = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const { title, content, tags, categoryId, newCategoryName } = req.body;

//     const post = await prisma.kBPost.findUnique({ where: { id } });
//     if (!post) return res.status(404).json({ message: "Post not found" });
//     if (!post.canEdit)
//       return res
//         .status(403)
//         .json({ message: "Edit not allowed for this post" });

//     let resolvedCategoryId = null;
//     try {
//       resolvedCategoryId = await resolveCategoryOnCreate({
//         categoryId,
//         newCategoryName,
//         userId: req.user?.id,
//       });
//     } catch (e) {
//       return res.status(400).json({ message: e.message });
//     }

//     await prisma.kBPost.update({
//       where: { id },
//       data: {
//         title,
//         content,
//         tags: tags ? (Array.isArray(tags) ? tags.join(",") : tags) : null,
//         categoryId: resolvedCategoryId,
//         status: "REVIEW",
//         rejectReason: null,
//         canEdit: false,
//       },
//     });

//     res.json({
//       message: "Post updated & submitted for review",
//       success: true,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating post", success: false });
//   }
// };
export const updatePostByUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, tags, categoryId, newCategoryName, contentImages } =
      req.body;

    const post = await prisma.kBPost.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.canEdit)
      return res
        .status(403)
        .json({ message: "Edit not allowed for this post" });

    let resolvedCategoryId = null;
    try {
      resolvedCategoryId = await resolveCategoryOnCreate({
        categoryId,
        newCategoryName,
        userId: req.user?.id,
      });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }

    await prisma.kBPost.update({
      where: { id },
      data: {
        title,
        content,
        tags: tags ? (Array.isArray(tags) ? tags.join(",") : tags) : null,
        categoryId: resolvedCategoryId,
        status: "REVIEW",
        rejectReason: null,
        canEdit: false,
      },
    });

    if (Array.isArray(contentImages)) {
      await syncPostImages(id, content, contentImages);
    }

    res.json({
      message: "Post updated & submitted for review",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating post", success: false });
  }
};

// ✅ Get Published Posts
export const getPublishedPosts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let categoryFilter = {};
    if (category && category !== "All") {
      const cat = await prisma.category.findUnique({
        where: { name: category },
      });
      categoryFilter = cat ? { categoryId: cat.id } : { categoryId: -1 };
    }

    const whereClause = {
      status: "PUBLISHED",
      ...categoryFilter,
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { tags: { contains: search } },
            ],
          }
        : {}),
    };

    const posts = await prisma.kBPost.findMany({
      where: whereClause,
      include: { author: true, category: true },
      orderBy: { publishedAt: "desc" },
    });

    const result = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      content: p.content,
      tags: p.tags ? p.tags.split(",") : [],
      status: p.status,
      publishedAt: p.publishedAt,
      category: formatCategory(p.category),
      author: p.author
        ? `${p.author.firstName} ${p.author.lastName}`
        : "Deleted User",
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};

// ✅ Get single published post (with category)
export const getKBPostById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.kBPost.findUnique({
      where: { id },
      include: { author: true, category: true },
    });

    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({
        message: "Post not found or not published",
        success: false,
      });
    }

    res.json({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.split(",") : [],
      category: formatCategory(post.category),
      status: post.status,
      author: post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : "Deleted User",
      publishedAt: post.publishedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching post",
      success: false,
    });
  }
};
// ✅ Get single published post by slug (for public URL)
export const getKBPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.kBPost.findUnique({
      where: { slug },
      include: { author: true, category: true },
    });

    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({
        message: "Post not found or not published",
        success: false,
      });
    }

    res.json({
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.split(",") : [],
      category: formatCategory(post.category),
      status: post.status,
      author: post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : "Deleted User",
      publishedAt: post.publishedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching post by slug",
      success: false,
    });
  }
};

// ✅ Admin: List posts under REVIEW
export const listReviewPosts = async (req, res) => {
  try {
    const posts = await prisma.kBPost.findMany({
      where: { status: "REVIEW" },
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    const result = posts.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      tags: p.tags ? p.tags.split(",") : [],
      status: p.status,
      createdAt: p.createdAt,
      category: formatCategory(p.category),
      author: p.author
        ? `${p.author.firstName} ${p.author.lastName}`
        : "Deleted User",
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error listing review posts",
      success: false,
    });
  }
};

// ✅ Admin: Publish post
// If post has a PENDING category → auto approve it
export const publishPost = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.kBPost.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    await prisma.$transaction(async (tx) => {
      // auto-approve category
      if (post.categoryId && post.category?.status === "PENDING") {
        await tx.category.update({
          where: { id: post.categoryId },
          data: { status: "APPROVED", approvedBy: req.user.id },
        });
      }

      await tx.kBPost.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
    });

    // notify author
    notifyUser(req, post.authorId, {
      postId: post.id,
      title: post.title,
      action: "PUBLISHED",
    });

    res.json({ message: "Post published", success: true });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({
      message: "Error publishing post",
      success: false,
    });
  }
};

// ✅ Delete post
// export const deletePost = async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const post = await prisma.kBPost.findUnique({ where: { id } });

//     if (!post)
//       return res
//         .status(404)
//         .json({ message: "Post not found", success: false });

//     await prisma.kBPost.delete({ where: { id } });

//     // optional notify
//     notifyUser(req, post.authorId, {
//       postId: post.id,
//       title: post.title,
//       action: "DELETED",
//     });

//     res.json({
//       message: "Post deleted successfully",
//       success: true,
//     });
//   } catch (err) {
//     console.error("Delete error:", err);
//     res.status(500).json({
//       message: "Error deleting post",
//       success: false,
//     });
//   }
// };
export const deletePost = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.kBPost.findUnique({
      where: { id },
      include: { images: true }, // 👈 include related images
    });

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // delete associated images from Cloudinary
    for (const img of post.images) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (e) {
        console.error("Failed to delete Cloudinary image:", e.message);
      }
    }

    await prisma.kBPost.delete({ where: { id } }); // images rows will cascade delete

    notifyUser(req, post.authorId, {
      postId: post.id,
      title: post.title,
      action: "DELETED",
    });

    res.json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      message: "Error deleting post",
      success: false,
    });
  }
};

// ✅ Get posts by logged-in user
// export const getPostsByUser = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     const userId = Number(req.user.id);

//     const posts = await prisma.kBPost.findMany({
//       where: { authorId: userId },
//       orderBy: { createdAt: "desc" },
//       include: { category: true },
//     });

//     const result = posts.map((p) => ({
//       id: p.id,
//       title: p.title,
//       status: p.status,
//       createdAt: p.createdAt,
//       category: formatCategory(p.category),
//     }));

//     res.json({ success: true, posts: result });
//   } catch (err) {
//     console.error("Error in getPostsByUser:", err);
//     res.status(500).json({ success: false, message: "Error fetching posts" });
//   }
// };
// ✅ Get posts by logged-in user (for dashboard)
// export const getPostsByUser = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     const userId = Number(req.user.id);

//     const posts = await prisma.kBPost.findMany({
//       where: { authorId: userId },
//       orderBy: { createdAt: "desc" },
//       include: { category: true },
//     });

//     const result = posts.map((p) => ({
//       id: p.id,
//       title: p.title,
//       content: p.content,
//       tags: p.tags ? p.tags.split(",") : [],
//       status: p.status,
//       rejectReason: p.rejectReason, // ✅ important for rejected posts
//       canEdit: p.canEdit, // ✅ key field for “Edit” button
//       createdAt: p.createdAt,
//       category: p.category
//         ? {
//             id: p.category.id,
//             name: p.category.name,
//             status: p.category.status,
//           }
//         : null,
//     }));

//     res.json({ success: true, posts: result });
//   } catch (err) {
//     console.error("Error in getPostsByUser:", err);
//     res.status(500).json({ success: false, message: "Error fetching posts" });
//   }
// };
export const getPostsByUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = Number(req.user.id);

    const posts = await prisma.kBPost.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const result = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      content: p.content, // include content for editing
      tags: p.tags ? p.tags.split(",") : [],
      status: p.status,
      createdAt: p.createdAt,
      rejectReason: p.rejectReason || null,
      canEdit: !!p.canEdit,
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            status: p.category.status,
          }
        : null,
    }));

    res.json({ success: true, posts: result });
  } catch (err) {
    console.error("Error in getPostsByUser:", err);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
};

export const rejectPost = async (req, res) => {
  try {
    const id = Number(req.params.id);
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
        rejectReason: reason || null,
        canEdit: true,
      },
    });

    notifyUser(req, post.authorId, {
      postId: post.id,
      title: post.title,
      action: "REJECTED",
      reason,
    });

    res.json({ message: "Post rejected", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting post", success: false });
  }
};
export const createUpdateRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId, reason } = req.body;

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!postId) return res.status(400).json({ message: "postId required" });

    const post = await prisma.kBPost.findUnique({
      where: { id: Number(postId) },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== userId)
      return res.status(403).json({ message: "Not your post" });

    if (post.status !== "PUBLISHED")
      return res.status(400).json({ message: "Only published posts allowed" });

    // avoid duplicate pending requests
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

    // notify all admins
    const io = req.app.get("io");
    io?.emit("admin:update-request", {
      id: reqEntry.id,
      postId: post.id,
      title: post.title,
      userId,
      reason: reqEntry.reason,
    });

    res.status(201).json({ message: "Request created", request: reqEntry });
  } catch (err) {
    console.error("createUpdateRequest:", err);
    res.status(500).json({ message: "Error creating update request" });
  }
};
export const listUpdateRequests = async (req, res) => {
  try {
    const requests = await prisma.updateRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true } },
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
export const actionUpdateRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { action, adminNote } = req.body;

    if (!["approve", "reject"].includes(action))
      return res.status(400).json({ message: "Invalid action" });

    const reqEntry = await prisma.updateRequest.findUnique({ where: { id } });

    if (!reqEntry)
      return res.status(404).json({ message: "Request not found" });

    if (reqEntry.status !== "PENDING")
      return res.status(400).json({ message: "Already processed" });

    if (action === "approve") {
      await prisma.kBPost.update({
        where: { id: reqEntry.postId },
        data: { canEdit: true },
      });

      await prisma.updateRequest.update({
        where: { id },
        data: { status: "APPROVED", adminNote: adminNote || null },
      });

      notifyUser(req, reqEntry.userId, {
        action: "APPROVED",
        postId: reqEntry.postId,
        title: "Edit access granted",
      });

      return res.json({ message: "Request approved" });
    }

    // Reject
    await prisma.updateRequest.update({
      where: { id },
      data: { status: "REJECTED", adminNote: adminNote || null },
    });

    notifyUser(req, reqEntry.userId, {
      action: "REJECTED",
      postId: reqEntry.postId,
      title: "Edit request rejected",
      reason: adminNote || null,
    });

    res.json({ message: "Request rejected" });
  } catch (err) {
    console.error("actionUpdateRequest:", err);
    res.status(500).json({ message: "Error processing request" });
  }
};
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
export const adminViewAllPosts = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.kBPost.findUnique({
      where: { id },
      include: { author: true, category: true },
    });

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    res.json({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags ? post.tags.split(",") : [],
      category: formatCategory(post.category),
      status: post.status,
      author: post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : "Deleted User",
      publishedAt: post.publishedAt,
      rejectReason: post.rejectReason,
    });
  } catch (err) {
    console.error("adminViewAllPosts:", err);
    res.status(500).json({ message: "Error fetching post", success: false });
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

export const uploadPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "kb-posts/content",
    });

    // remove local temp file
    fs.unlink(req.file.path, () => {});

    return res.status(201).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("uploadPostImage error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error uploading image" });
  }
};
