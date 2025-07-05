import sharp from "sharp";
import crypto from "crypto";
import prisma from "../database/db.js";
import s3Client from "../s3/s3Client.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";



const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

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

export async function uploadToS3(key, imageBuffer, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: imageBuffer,
    ContentType: contentType,
  });
  await s3Client.send(command);
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
