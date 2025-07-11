import multer from "multer";
import { Request } from "express";
import path from 'path';
import fs from 'fs';
 
const storage = multer.diskStorage({
 
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    // Resolve the path to the "uploads/temp" directory (one level up from current file)
    const tempPath = path.join(__dirname, '..', 'uploads', 'temp');

    // If the "temp" folder does not exist, create it
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }

    // Set the destination for the uploaded files
    cb(null, tempPath);
  },

  
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
   
    cb(null, file.originalname);
  }
});

// Export the Multer middleware to handle file uploads
 
export const upload = multer({ storage }).fields([
  { name: 'files', maxCount: 10 }
]);
