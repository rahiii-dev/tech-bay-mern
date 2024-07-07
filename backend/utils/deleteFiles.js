import fs from 'fs';

export const deleteFiles = (files) => {
  files.forEach((file) => {
    if(file){
      fs.unlink((file), (err) => {
        if(err){
          console.log("Error Deleteing file", file);
        }
      })
    }
  });
};

