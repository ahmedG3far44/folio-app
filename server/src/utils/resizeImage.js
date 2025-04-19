import sharp from "sharp";

export default async function resizedImage(buffer, width, height, quality) {
  const resizedImage = await sharp(buffer)
    .resize(width, height, { withoutEnlargement: true, fit: "cover" })
    .toFormat("webp")
    .webp({ quality })
    .toBuffer();
  return resizedImage;
}

