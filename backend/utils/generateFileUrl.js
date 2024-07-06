export const generateFileURL = (filePath) => {
    const uploadsIndex = filePath.indexOf('uploads');
    if (uploadsIndex !== -1) {
      return '/' + filePath.substring(uploadsIndex).replace(/\\/g, '/');
    }
    return null;
  };
  