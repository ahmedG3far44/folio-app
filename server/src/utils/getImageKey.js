export default function getImageKey(url) {
  const key = url.split(".com/")[1];
  return key;
}
