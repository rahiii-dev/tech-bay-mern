import fs from 'fs';

export const deleteFiles = (files) => {
  // files.forEach((file) => {
  //   if(file){
  //     fs.unlink((file), (err) => {
  //       if(err){
  //         console.log("Error Deleteing file", file);
  //       }
  //     })
  //   }
  // });
};

export const generateFileURL = (filePath) => {
    const uploadsIndex = filePath.indexOf('uploads');
    if (uploadsIndex !== -1) {
      return '/' + filePath.substring(uploadsIndex).replace(/\\/g, '/');
    }
    return null;
  };
  