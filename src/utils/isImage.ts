function isImage(object) {
  return object && object.objClass() === "Image" && object.get("blob");
}

function isImageFormat(extension) {
  const images = ["png", "jpg", "jpeg", "gif"];
  return images.includes(extension);
}

export { isImage, isImageFormat };
