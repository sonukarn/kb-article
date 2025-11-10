// src/controllers/categoryController.js
import prisma from "../config/prismaClient.js";

// List categories (optionally by status)
// GET /api/categories?status=APPROVED|PENDING|REJECTED
export const listCategories = async (req, res) => {
  try {
    const { status, q } = req.query;
    const where = {
      ...(status ? { status } : {}),
      ...(q ? { name: { contains: q } } : {}),
    };
    const cats = await prisma.category.findMany({
      where,
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
    res.json({ success: true, categories: cats });
  } catch (err) {
    console.error("listCategories:", err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching categories" });
  }
};

// Create category (user can suggest)
// POST /api/categories { name }
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const clean = name.trim();

    // If exists, return it (don’t error)
    let existing = await prisma.category.findUnique({ where: { name: clean } });
    if (existing) {
      return res.json({ success: true, category: existing, existed: true });
    }

    const category = await prisma.category.create({
      data: {
        name: clean,
        status: "PENDING",
        createdBy: req.user?.id ?? null,
      },
    });
    res.status(201).json({ success: true, category });
  } catch (err) {
    console.error("createCategory:", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating category" });
  }
};

// Approve category (admin)
// PATCH /api/categories/:id/approve
export const approveCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const updated = await prisma.category.update({
      where: { id },
      data: { status: "APPROVED", approvedBy: req.user.id },
    });
    res.json({ success: true, category: updated });
  } catch (err) {
    console.error("approveCategory:", err);
    res
      .status(500)
      .json({ success: false, message: "Error approving category" });
  }
};

// Reject category (admin) -> also detach from any posts
// PATCH /api/categories/:id/reject
export const rejectCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) return res.status(404).json({ message: "Category not found" });

    await prisma.$transaction([
      prisma.kBPost.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      }),
      prisma.category.update({
        where: { id },
        data: { status: "REJECTED" },
      }),
    ]);

    res.json({
      success: true,
      message: "Category rejected & detached from posts",
    });
  } catch (err) {
    console.error("rejectCategory:", err);
    res
      .status(500)
      .json({ success: false, message: "Error rejecting category" });
  }
};

// Rename category (admin)
// PATCH /api/categories/:id  { name }
export const renameCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    });
    res.json({ success: true, category: updated });
  } catch (err) {
    console.error("renameCategory:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Category name already exists" });
    }
    res
      .status(500)
      .json({ success: false, message: "Error renaming category" });
  }
};

// Delete category (admin) -> posts set categoryId=null (thanks to onDelete: SetNull)
export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const cat = await prisma.category.findUnique({ where: { id } });
    if (!cat) return res.status(404).json({ message: "Category not found" });

    await prisma.category.delete({ where: { id } });
    res.json({
      success: true,
      message: "Category deleted. Posts were detached.",
    });
  } catch (err) {
    console.error("deleteCategory:", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting category" });
  }
};
