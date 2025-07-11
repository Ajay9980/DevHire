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
exports.uploadUserImg = exports.getUserById = exports.signout = exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password, name, role } = req.body;
    try {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const files = (_a = req.files) === null || _a === void 0 ? void 0 : _a.files;
        const filePath = files === null || files === void 0 ? void 0 : files[0].path;
        console.log(filePath);
        if (!filePath) {
            res.status(404).json({
                message: 'file not found'
            });
            return;
        }
        const file = yield (0, cloudinary_1.uploadOnCloudinary)(filePath);
        console.log(file);
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                imgurl: file === null || file === void 0 ? void 0 : file.url
            }
        });
        res.status(201).json({
            message: "User Created",
            user: user
        });
    }
    catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            message: "Something went wrong :- " + error
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email,
            }
        });
        if (!user) {
            res.status(404).json({
                message: 'user not found'
            });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!isMatch) {
            res.status(403).json({
                message: 'invalid password'
            });
            return;
        }
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });
            res.status(200).json({
                message: "User signed in successfully"
            });
        }
        else {
            res.status(401).json({
                message: "Invalid email or password"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong: " + error
        });
    }
});
exports.signin = signin;
const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        res.status(200).json({
            message: 'user signed out successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong :-  ' + error
        });
    }
});
exports.signout = signout;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                bids: true
            }
        });
        res.status(200).json({
            user: user
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong while fetching the user, :- ' + error
        });
    }
});
exports.getUserById = getUserById;
const uploadUserImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.userId;
    const files = (_a = req.files) === null || _a === void 0 ? void 0 : _a.files;
    const filePath = files === null || files === void 0 ? void 0 : files[0].path;
    if (!filePath) {
        res.status(404).json({
            message: 'file path is required'
        });
    }
    const file = yield (0, cloudinary_1.uploadOnCloudinary)(filePath);
    if (!(file === null || file === void 0 ? void 0 : file.url)) {
        res.status(500).json({
            message: 'uploading the image failed'
        });
        return;
    }
    yield prisma.user.update({
        where: { id: userId },
        data: {
            imgurl: file === null || file === void 0 ? void 0 : file.url
        }
    });
    res.status(200).json({
        message: 'user image uploaded successfully'
    });
});
exports.uploadUserImg = uploadUserImg;
