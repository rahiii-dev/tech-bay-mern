import fs from 'fs';
import path from 'path';

export const deleteFiles = (files) => {
  files.forEach((file) => {
    if (typeof file === 'string') { 
      const filePath = path.resolve(file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        } 
      });
    } else {
      console.error(`Invalid file path: ${file}`);
    }
  });
};

