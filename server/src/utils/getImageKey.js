import { getPublicIdFromUrl } from "./upload.js";

export default function getImageKey(url) {
  return getPublicIdFromUrl(url);
}
