import prisma from "../config/prismaClient.js"; // adjust path if needed
import { generateShortSlug } from "../utils/generateSlug.js";

async function main() {
  const posts = await prisma.kBPost.findMany({
    where: { slug: null },
  });

  console.log(`Found ${posts.length} posts without slug`);

  for (const p of posts) {
    let baseSlug = generateShortSlug(p.title);
    let finalSlug = baseSlug;
    let counter = 1;

    // ensure unique
    while (true) {
      const existing = await prisma.kBPost.findUnique({
        where: { slug: finalSlug },
      });
      if (!existing) break;
      finalSlug = `${baseSlug}-${counter++}`;
    }

    await prisma.kBPost.update({
      where: { id: p.id },
      data: { slug: finalSlug },
    });

    console.log(`Post ${p.id} -> ${finalSlug}`);
  }

  console.log("Done");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
