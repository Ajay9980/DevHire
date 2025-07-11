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
exports.markComplete = exports.getBidsTasks = exports.getMyTasks = exports.getTaskById = exports.getTask = exports.createTask = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, budget } = req.body;
    const userId = req.userId;
    try {
        if (!userId) {
            res.status(401).json({
                message: 'user not logged in'
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.role) === 'CLIENT') {
            yield prisma.task.create({
                data: {
                    title,
                    description,
                    budget,
                    clientId: userId
                }
            });
            res.status(200).json({
                message: 'task posted'
            });
        }
        else {
            res.status(403).json({
                message: 'you are developer , so you are not allowed to post the task'
            });
        }
    }
    catch (error) {
        console.log(' The Error is:-  ', error);
        res.status(500).json({
            messsage: error
        });
    }
});
exports.createTask = createTask;
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield prisma.task.findMany();
        res.status(200).json({
            tasks: tasks
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong:- ' + error
        });
    }
});
exports.getTask = getTask;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    try {
        const task = yield prisma.task.findUnique({
            where: { id: taskId },
            include: {
                client: true
            }
        });
        res.status(200).json({
            task: task
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong ' + error
        });
    }
});
exports.getTaskById = getTaskById;
const getMyTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const task = yield prisma.task.findMany({
            where: {
                clientId: userId
            },
            include: {
                client: true
            }
        });
        res.status(200).json({
            tasks: task
        });
    }
    catch (error) {
        res.status(500).json({
            messsage: 'something went wrong while get your tasks :- ' + error
        });
    }
});
exports.getMyTasks = getMyTasks;
const getBidsTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const tasks = yield prisma.bid.findMany({
            where: {
                developerId: userId
            },
            include: {
                task: true
            }
        });
        res.status(200).json({
            tasks: tasks
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'someting went wrong while getting BidsTasks :- ' + error
        });
    }
});
exports.getBidsTasks = getBidsTasks;
const markComplete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const taskId = parseInt(req.params.id);
    const task = yield prisma.task.findUnique({
        where: {
            id: taskId
        }
    });
    if ((task === null || task === void 0 ? void 0 : task.clientId) !== userId) {
        res.status(403).json({
            message: "Unauthorized user!"
        });
        return;
    }
    const updatedTask = yield prisma.task.update({
        where: { id: taskId },
        data: { status: 'COMPLETED' }
    });
    res.status(200).json({
        message: 'your task has been completed',
        updatedTask: updatedTask
    });
});
exports.markComplete = markComplete;
