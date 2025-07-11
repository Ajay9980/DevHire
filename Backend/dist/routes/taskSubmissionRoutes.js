"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userMiddleware_1 = require("../middlewares/userMiddleware");
const taskSubmissionController_1 = require("../controllers/taskSubmissionController");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const router = express_1.default.Router();
router.post('/upload/task/:id', userMiddleware_1.userMiddleware, multerMiddleware_1.upload, taskSubmissionController_1.uploadTaskFile);
router.get('/getfileurl/:id', taskSubmissionController_1.getFileUrl);
exports.default = router;
