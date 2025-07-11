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
exports.getUserPayment = exports.verifyPayment = exports.createPaymentOrder = void 0;
const client_1 = require("@prisma/client");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient;
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
const createPaymentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.body.taskId);
    const bidId = parseInt(req.body.bidId);
    try {
        const bid = yield prisma.bid.findUnique({
            where: { id: bidId },
            include: { task: true }
        });
        if (!bid) {
            res.status(404).json({
                message: 'bid not Found '
            });
            return;
        }
        const amount = (bid === null || bid === void 0 ? void 0 : bid.amount) * 100;
        const developerId = bid === null || bid === void 0 ? void 0 : bid.developerId;
        const order = yield razorpay.orders.create({
            amount,
            currency: 'INR',
            receipt: `receipt_${taskId}_${bidId}`
        });
        yield prisma.payment.create({
            data: {
                taskId: taskId,
                bidId: bidId,
                developerId: developerId,
                amount: bid.amount,
                razorpayOrderId: order.id,
                status: 'CREATED'
            }
        });
        res.status(200).json({
            order: order,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong with creating payment :- ' + error
        });
    }
});
exports.createPaymentOrder = createPaymentOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const hmac = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (hmac !== razorpay_signature) {
            res.status(400).json({ success: false, message: 'invalid signature' });
            return;
        }
        const payment = yield prisma.payment.findFirst({
            where: { razorpayOrderId: razorpay_order_id }
        });
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        yield prisma.payment.update({
            where: { id: payment === null || payment === void 0 ? void 0 : payment.id },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: 'PAID'
            }
        });
        yield prisma.task.update({
            where: { id: payment === null || payment === void 0 ? void 0 : payment.taskId },
            data: { status: 'IN_PROGRESS' }
        });
        res.status(200).json({
            success: true, message: 'payment  verified and accepted'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong with verifying the payment:- ' + error
        });
    }
});
exports.verifyPayment = verifyPayment;
const getUserPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const developerId = req.userId;
    try {
        const total = yield prisma.payment.aggregate({
            _sum: {
                amount: true
            },
            where: {
                developerId: developerId,
                status: 'PAID'
            }
        });
        if (total._sum.amount === null) {
            res.status(200).json({
                earnings: 0,
            });
            return;
        }
        res.status(200).json({
            earnings: total._sum.amount,
        });
    }
    catch (error) {
        res.status(200).json({
            message: 'someting went wrong  with getting user payment :- ' + error
        });
    }
});
exports.getUserPayment = getUserPayment;
