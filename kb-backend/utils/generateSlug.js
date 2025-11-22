import slugify from "slugify";

export function generateShortSlug(title) {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove special chars
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned
    .split(" ")
    .filter((w) => w.length > 2) // remove very small words: in, to, of, is
    .slice(0, 5) // first 5 words max
    .join(" ");

  return slugify(words || cleaned, {
    lower: true,
    strict: true,
    trim: true,
  });
}
