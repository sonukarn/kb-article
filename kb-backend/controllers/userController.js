import prisma from "../config/prismaClient.js";

export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        posts: { select: { id: true } },
      },
    });

    res.json(
      users.map((u) => ({
        ...u,
        postCount: u.posts.length,
      }))
    );
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};
// controllers/userController.js
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, phone },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { posts: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 1: Nullify their post authorship manually (optional — but safe)
    await prisma.kBPost.updateMany({
      where: { authorId: userId },
      data: { authorId: null },
    });

    // Step 2: Delete the user (cascade will remove tokens, updateRequests, etc.)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      success: true,
      message: `User '${user.firstName} ${user.lastName}' deleted successfully`,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};
