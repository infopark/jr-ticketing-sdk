import txtIcon from "src/assets/images/icons/txt.svg";
import pdfIcon from "src/assets/images/icons/pdf.svg";
import fileIcon from "src/assets/images/icons/file.svg";

const getFileExtension = (fileName) => {
  if (!fileName || !fileName.split(".").length) {
    return null;
  }
  return fileName.split(".").pop().toLowerCase();
};

const knownFileTypes = { txt: txtIcon, pdf: pdfIcon };

const matchExtension = (ext) => {
  const imgExts = ["jpg", "jpeg", "png", "svg", "tiff", "gif"];
  if (imgExts.includes(ext)) {
    return "image";
  }
  if (Object.keys(knownFileTypes).includes(ext)) {
    return knownFileTypes[ext];
  }
  return fileIcon;
};

export { getFileExtension, matchExtension };
