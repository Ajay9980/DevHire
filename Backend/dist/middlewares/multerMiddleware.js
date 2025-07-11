"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Resolve the path to the "uploads/temp" directory (one level up from current file)
        const tempPath = path_1.default.join(__dirname, '..', 'uploads', 'temp');
        // If the "temp" folder does not exist, create it
        if (!fs_1.default.existsSync(tempPath)) {
            fs_1.default.mkdirSync(tempPath, { recursive: true });
        }
        // Set the destination for the uploaded files
        cb(null, tempPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
// Export the Multer middleware to handle file uploads
exports.upload = (0, multer_1.default)({ storage }).fields([
    { name: 'files', maxCount: 10 }
]);
