"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const router = express_1.default.Router();
router.post('/createpayment', paymentController_1.createPaymentOrder);
router.post('/verifypayment', paymentController_1.verifyPayment);
router.get('/getuserpayment', userMiddleware_1.userMiddleware, paymentController_1.getUserPayment);
exports.default = router;
