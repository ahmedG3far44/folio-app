const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
const THUMBNAIL_TYPES = [...IMAGE_TYPES, "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"];

export default function verifyUploading(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (files.length === 0) return next();

  for (const file of files) {
    if (!file) {
      return res.status(400).json({
        error: "not found error",
        message: "error not found file",
      });
    }

    if (file.fieldname === "thumbnail") {
      if (file.size >= 10485760) {
        return res.status(400).json({
          error: "large size error",
          message: "Thumbnail size too large. Max 10MB allowed.",
        });
      }
      if (!THUMBNAIL_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          error: "file type error",
          message: "Thumbnail must be JPEG, PNG, WEBP, GIF, MP4, WEBM, MOV, AVI, or MKV.",
        });
      }
    } else {
      if (file.size >= 4194304) {
        return res.status(400).json({
          error: "large size error",
          message: "Image size too large. Upload images less than 4MB.",
        });
      }
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          error: "file type error",
          message: "Image must be JPEG, PNG, WEBP, or GIF.",
        });
      }
    }
  }

  return next();
}
