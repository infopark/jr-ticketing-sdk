import txtIcon from "../assets/images/icons/txt.svg";
import pdfIcon from "../assets/images/icons/pdf.svg";
import fileIcon from "../assets/images/icons/file.svg";

const getFileExtension = (fileName) => {
  if (!fileName || !fileName.split(".").length) {
    return null;
  }
  return fileName.split(".").pop().toLowerCase();
};

const knownFileTypes = { txt: txtIcon, pdf: pdfIcon };

const matchExtension = (ext: string) => {
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
