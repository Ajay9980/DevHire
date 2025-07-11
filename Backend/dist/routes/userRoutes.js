"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userMiddleware_1 = require("../middlewares/userMiddleware");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const router = express_1.default.Router();
router.post('/signup', multerMiddleware_1.upload, userController_1.signup);
router.post('/signin', userController_1.signin);
router.post('/signout', userController_1.signout);
router.get('/user', userMiddleware_1.userMiddleware, userController_1.getUserById);
router.post('/uploadimg', userMiddleware_1.userMiddleware, multerMiddleware_1.upload, userController_1.uploadUserImg);
exports.default = router;
