import fileIcon from "../assets/images/icons/file.svg";
import pdfIcon from "../assets/images/icons/pdf.svg";
import wordIcon from "../assets/images/icons/word.svg";
import zipIcon from "../assets/images/icons/zip.svg";

const getFileExtension = (fileName) => {
  if (!fileName || !fileName.split(".").length) {
    return null;
  }
  return fileName.split(".").pop().toLowerCase();
};

const knownFileTypes = {
  doc: wordIcon,
  docx: wordIcon,
  pdf: pdfIcon,
  zip: zipIcon,
};

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
