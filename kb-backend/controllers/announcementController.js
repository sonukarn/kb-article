// import prisma from "../config/prismaClient.js";

// export const getAnnouncements = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const isAdmin = req.user?.role === "ADMIN";
//     const showAll = req.query.all === "true" || isAdmin;
//     const now = new Date();

//     const where = showAll
//       ? {} // show all announcements for admin
//       : {
//           isActive: true,
//           AND: [
//             { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
//             { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
//           ],
//         };

//     const anns = await prisma.announcement.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//     });

//     // If public or admin fetching all, skip dismissal logic
//     if (showAll || !userId) {
//       return res.json(anns);
//     }

//     // Apply user dismissals for normal authenticated users
//     const dismissed = await prisma.announcementDismissal.findMany({
//       where: { userId, announcementId: { in: anns.map((a) => a.id) } },
//       select: { announcementId: true },
//     });

//     const dismissedIds = new Set(dismissed.map((d) => d.announcementId));
//     const filtered = anns.filter(
//       (a) => !(a.dismissible && dismissedIds.has(a.id))
//     );

//     res.json(filtered);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch announcements" });
//   }
// };
// // POST /api/announcements  (admin)
// export const createAnnouncement = async (req, res) => {
//   try {
//     const {
//       title,
//       message,
//       type = "info",
//       isActive = true,
//       dismissible = true,
//       startsAt = null,
//       endsAt = null,
//     } = req.body;
//     const entry = await prisma.announcement.create({
//       data: {
//         title,
//         message,
//         type,
//         isActive,
//         dismissible,
//         startsAt: startsAt ? new Date(startsAt) : null,
//         endsAt: endsAt ? new Date(endsAt) : null,
//       },
//     });

//     // broadcast to all connected clients
//     const io = req.app.get("io");
//     io?.emit("announcement:changed", {
//       action: "created",
//       announcement: entry,
//     });

//     res.json(entry);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create announcement" });
//   }
// };

// // PUT /api/announcements/:id  (admin)
// export const updateAnnouncement = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const payload = req.body;
//     const updated = await prisma.announcement.update({
//       where: { id },
//       data: payload,
//     });

//     const io = req.app.get("io");
//     io?.emit("announcement:changed", {
//       action: "updated",
//       announcement: updated,
//     });

//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to update announcement" });
//   }
// };

// // DELETE /api/announcements/:id  (admin)
// export const deleteAnnouncement = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     await prisma.announcement.delete({ where: { id } });

//     const io = req.app.get("io");
//     io?.emit("announcement:changed", { action: "deleted", id });

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to delete announcement" });
//   }
// };

// // POST /api/announcements/:id/dismiss  (authenticated user)
// export const dismissAnnouncement = async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Not authenticated" });

//     await prisma.announcementDismissal.upsert({
//       where: { userId_announcementId: { userId, announcementId: id } },
//       update: { dismissedAt: new Date() },
//       create: { userId, announcementId: id },
//     });

//     // optionally notify admin or emit to user only (not needed)
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to dismiss" });
//   }
// };

import prisma from "../config/prismaClient.js";

// GET /api/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const showAll = req.query.all === "true" || isAdmin;
    const now = new Date();

    const where = showAll
      ? {} // show all announcements for admin
      : {
          isActive: true,
          AND: [
            { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
            { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
          ],
        };

    const anns = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (showAll || !userId) {
      return res.json(anns);
    }

    const dismissed = await prisma.announcementDismissal.findMany({
      where: { userId, announcementId: { in: anns.map((a) => a.id) } },
      select: { announcementId: true },
    });

    const dismissedIds = new Set(dismissed.map((d) => d.announcementId));
    const filtered = anns.filter(
      (a) => !(a.dismissible && dismissedIds.has(a.id))
    );

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};

// POST /api/announcements  (admin)
export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      type = "info",
      isActive = true,
      dismissible = true,
      startsAt = null,
      endsAt = null,
      durationMinutes = null, // new field
    } = req.body;

    let calculatedEndsAt = endsAt ? new Date(endsAt) : null;

    // Only for success type: calculate endsAt using duration
    if (type === "success" && durationMinutes) {
      const startTime = startsAt ? new Date(startsAt) : new Date();
      calculatedEndsAt = new Date(
        startTime.getTime() + durationMinutes * 60 * 1000
      );
    }

    const entry = await prisma.announcement.create({
      data: {
        title,
        message,
        type,
        isActive,
        dismissible,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: calculatedEndsAt,
      },
    });

    const io = req.app.get("io");
    io?.emit("announcement:changed", {
      action: "created",
      announcement: entry,
    });

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create announcement" });
  }
};

// PUT /api/announcements/:id  (admin)
export const updateAnnouncement = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      message,
      type,
      isActive,
      dismissible,
      startsAt = null,
      endsAt = null,
      durationMinutes = null, // new field
    } = req.body;

    let calculatedEndsAt = endsAt ? new Date(endsAt) : null;

    if (type === "success" && durationMinutes) {
      const startTime = startsAt ? new Date(startsAt) : new Date();
      calculatedEndsAt = new Date(
        startTime.getTime() + durationMinutes * 60 * 1000
      );
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        message,
        type,
        isActive,
        dismissible,
        startsAt: startsAt ? new Date(startsAt) : null,
        endsAt: calculatedEndsAt,
      },
    });

    const io = req.app.get("io");
    io?.emit("announcement:changed", {
      action: "updated",
      announcement: updated,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update announcement" });
  }
};

// DELETE /api/announcements/:id  (admin)
export const deleteAnnouncement = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.announcement.delete({ where: { id } });

    const io = req.app.get("io");
    io?.emit("announcement:changed", { action: "deleted", id });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete announcement" });
  }
};

// POST /api/announcements/:id/dismiss  (authenticated user)
export const dismissAnnouncement = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    await prisma.announcementDismissal.upsert({
      where: { userId_announcementId: { userId, announcementId: id } },
      update: { dismissedAt: new Date() },
      create: { userId, announcementId: id },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to dismiss" });
  }
};
