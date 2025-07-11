"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.uploadTaskFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const uploadTaskFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const taskId = parseInt(req.params.id);
    const developerId = req.userId;
    if (!developerId) {
        res.status(401).json({ message: 'Unauthorized. Developer ID missing.' });
        return;
    }
    const bid = yield prisma.bid.findFirst({
        where: {
            developerId: developerId,
            taskId: taskId,
            status: 'ACCEPTED'
        }
    });
    if (!bid) {
        res.status(403).json({
            message: 'you are not allowed to upload for this task'
        });
        return;
    }
    // Safely extract the uploaded files array from req.files (since we're using multer.fields)
    // Then get the path of the first uploaded file (assuming 'files' is the field name)
    const files = (_a = req.files) === null || _a === void 0 ? void 0 : _a.files;
    const filePath = (_b = files === null || files === void 0 ? void 0 : files[0]) === null || _b === void 0 ? void 0 : _b.path;
    if (!filePath) {
        res.status(400).json({
            message: 'Select the files'
        });
        return;
    }
    const file = yield (0, cloudinary_1.uploadOnCloudinary)(filePath);
    if (!(file === null || file === void 0 ? void 0 : file.url)) {
        res.status(400).json({
            message: "File upload failed",
        });
        return;
    }
    const submission = yield prisma.taskSubmission.create({
        data: {
            taskId: taskId,
            developerId: developerId,
            fileUrl: file === null || file === void 0 ? void 0 : file.url
        }
    });
    yield prisma.task.update({
        where: { id: taskId },
        data: {
            status: 'SUBMITTED'
        }
    });
    res.status(200).json({
        message: 'Task Submitted',
        submittedTask: submission
    });
});
exports.uploadTaskFile = uploadTaskFile;
const getFileUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    try {
        const file = yield prisma.taskSubmission.findFirst({
            where: {
                taskId: taskId
            }
        });
        if (!file) {
            res.status(404).json({
                message: 'file  not found'
            });
        }
        res.status(200).json({
            file: file
        });
    }
    catch (error) {
        message: 'someting went wrong with getting file url:- ' + error;
    }
});
exports.getFileUrl = getFileUrl;
