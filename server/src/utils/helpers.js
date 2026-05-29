import sharp from "sharp";
import crypto from "crypto";
import prisma from "../configs/db.js";

export async function getBioWithImage(userId, bioId) {
  return await prisma.bio.findFirst({
    where: { usersId: userId, id: bioId },
    select: { heroImage: true },
  });
}

export async function processImage(image) {
  return await sharp(image.buffer)
    .resize(320, 320, { withoutEnlargement: true, fit: "inside" })
    .toFormat("webp")
    .keepMetadata()
    .webp({ quality: 80 })
    .toBuffer();
}

export function generateFileKey() {
  return `hero-img-${crypto.randomUUID()}`;
}

export async function updateBioImage(userId, bioId, imageUrl) {
  await prisma.bio.update({
    where: { usersId: userId, id: bioId },
    data: {
      heroImage: imageUrl,
      usersId: userId,
    },
  });
}
