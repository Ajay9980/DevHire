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
exports.getBidsByTaskId = exports.getBids = exports.acceptBid = exports.createBid = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const createBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, proposal } = req.body;
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    try {
        if (!userId) {
            res.status(201).json({
                message: 'user not logged in'
            });
            return;
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.role) === 'DEVELOPER') {
            const bid = yield prisma.bid.create({
                data: {
                    amount,
                    proposal,
                    taskId,
                    developerId: userId
                }
            });
            res.status(200).json({
                message: 'you bid has been posted to client',
                bid: bid
            });
        }
        else {
            res.status(201).json({
                messsage: 'Only developers can post the bids !'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong :- ' + error
        });
    }
});
exports.createBid = createBid;
const acceptBid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    const { bidId } = req.body;
    const userId = req.userId;
    try {
        // getting the task
        const task = yield prisma.task.findUnique({
            where: {
                id: taskId
            }
        });
        if (!task) {
            res.status(404).json({
                message: 'invalid Id , Task Not Found'
            });
            return;
        }
        // checking if the task belongs to client
        if (task.clientId === userId) {
            yield prisma.bid.update({
                where: { id: bidId },
                data: { status: 'ACCEPTED' } //accepting the bid
            });
            yield prisma.bid.updateMany({
                where: {
                    taskId: taskId,
                    id: { not: bidId }
                },
                data: {
                    status: 'REJECTED' // rejecting  all other bid
                }
            });
            res.status(200).json({
                message: 'Bid Accepted'
            });
        }
        else {
            res.status(403).json({
                message: 'Unauthorized Client !'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'something  went wrong'
        });
    }
});
exports.acceptBid = acceptBid;
const getBids = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if ((user === null || user === void 0 ? void 0 : user.role) === 'CLIENT') {
            const bids = yield prisma.bid.findMany({
                where: { taskId: taskId },
                include: {
                    developer: true
                }
            });
            if (!bids) {
                res.status(200).json({
                    message: 'no one posted the bid yet!'
                });
                return;
            }
            res.status(200).json({
                bids: bids
            });
        }
        else {
            res.status(403).json({
                message: 'Unauthorized ! , only task host can see the bids'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong with getting the bids :-' + error
        });
    }
});
exports.getBids = getBids;
const getBidsByTaskId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    try {
        const bids = yield prisma.bid.findMany({
            where: {
                taskId: taskId,
                status: 'ACCEPTED'
            },
            include: {
                task: true
            }
        });
        if (bids.length === 0) {
            res.status(200).json({
                message: 'you did not accepted any bid yet'
            });
            return;
        }
        res.status(200).json({
            bids: bids
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong :- ' + error
        });
    }
});
exports.getBidsByTaskId = getBidsByTaskId;
