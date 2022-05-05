const attachmentSize = (e, maxSize) => {
  const file = e.target.files[0];
  const fileSize = file?.size || 0;
  return fileSize > maxSize;
};

const inputMaxSize = (e, maxSize) => {
  const { value } = e.target;
  return value.length > maxSize;
};

const inputMinSize = (e, minSize) => {
  const { value } = e.target;
  return value.trim().length < minSize;
};

export { attachmentSize, inputMaxSize, inputMinSize };
