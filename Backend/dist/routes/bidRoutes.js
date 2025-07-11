"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userMiddleware_1 = require("../middlewares/userMiddleware");
const bidController_1 = require("../controllers/bidController");
const router = express_1.default.Router();
router.post('/bid/:id', userMiddleware_1.userMiddleware, bidController_1.createBid);
router.post('/acceptbid/task/:id', userMiddleware_1.userMiddleware, bidController_1.acceptBid);
router.get('/bid/:id', userMiddleware_1.userMiddleware, bidController_1.getBids);
router.get('/bidbytaskid/:id', userMiddleware_1.userMiddleware, bidController_1.getBidsByTaskId);
exports.default = router;
