"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const router = express_1.default.Router();
router.post("/tasks", userMiddleware_1.userMiddleware, taskController_1.createTask);
router.get('/tasks', taskController_1.getTask);
router.get('/task/:id', taskController_1.getTaskById);
router.get('/task', userMiddleware_1.userMiddleware, taskController_1.getMyTasks);
router.get('/bidtask', userMiddleware_1.userMiddleware, taskController_1.getBidsTasks);
router.post('/markcomplete/:id', userMiddleware_1.userMiddleware, taskController_1.markComplete);
exports.default = router;
