function isImage(object) {
  return object && object.objClass() === "Image" && object.get("blob");
}

function isImageFormat(extension) {
  if (!extension) {
    return null;
  }
  const images = ["png", "jpg", "jpeg", "gif"];
  return images.includes(extension.toLowerCase());
}

export { isImage, isImageFormat };
