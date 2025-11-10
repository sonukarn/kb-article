// scripts/migrateCategories.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function run() {
  // 1) Get distinct old string categories from KBPost.category (may be null)
  const rows = await prisma.kBPost.findMany({
    where: { category: { not: null } },
    select: { id: true, category: true },
  });

  // Build map name -> ids
  const byName = new Map();
  for (const r of rows) {
    const name = r.category.trim();
    if (!name) continue;
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(r.id);
  }

  console.log("Distinct categories:", byName.size);

  for (const [name, postIds] of byName.entries()) {
    // 2) Ensure category exists (APPROVED since existing data is already in use)
    let cat = await prisma.category.findUnique({ where: { name } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name, status: "APPROVED" },
      });
      console.log("Created category:", name, "id:", cat.id);
    } else {
      // If existed but not approved, approve it since legacy posts use it
      if (cat.status !== "APPROVED") {
        await prisma.category.update({
          where: { id: cat.id },
          data: { status: "APPROVED" },
        });
      }
    }

    // 3) Update posts to point to categoryId
    await prisma.kBPost.updateMany({
      where: { id: { in: postIds } },
      data: { categoryId: cat.id },
    });

    console.log(`Linked ${postIds.length} post(s) to ${name}`);
  }

  console.log("Done.");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
