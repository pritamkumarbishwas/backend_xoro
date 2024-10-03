import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        // Generate a unique identifier (UUID) for the new file name
        const uniqueId = uuidv4();
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const newFileName = `${uniqueId}${fileExtension}`;
        cb(null, newFileName);
    }
});

// Multer upload configuration
export const upload = multer({ storage });
