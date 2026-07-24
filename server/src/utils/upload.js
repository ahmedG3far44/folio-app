import cloudinary from "../configs/cloudinary.js";

export async function uploadMedia(buffer, { folder = "folio", publicId, resourceType = "auto", ...options } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id, resourceType: result.resource_type });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadImage(buffer, { folder = "folio", publicId, ...options } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadResume(buffer, mimetype, folder = "folio/resumes") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        format: mimetype === "application/pdf" ? "pdf" : undefined,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

export function getPublicIdFromUrl(url) {
  const parts = url.split("/");
  const versionIndex = parts.findIndex((p) => p.startsWith("v") && !isNaN(p.slice(1)));
  if (versionIndex === -1) return null;
  return parts.slice(versionIndex + 1).join("/").replace(/\.[^.]+$/, "");
}
