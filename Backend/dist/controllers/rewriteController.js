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
exports.rewrite = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const rewrite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { text } = req.body;
    if (!text) {
        res.status(400).json({
            message: 'Text is Required'
        });
        return;
    }
    try {
        const prompt = `Rewrite the following freelance proposal to be clear, concise, and professional in just 3-4 lines. Highlight strengths, skills, and the value you offer. Return only the improved, shortened proposal:\n\n"${text}"`;
        const payload = {
            contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }]
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const response = yield fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = yield response.json();
        const rewrittenText = (_b = (_a = result === null || result === void 0 ? void 0 : result.candidates[0].content) === null || _a === void 0 ? void 0 : _a.parts) === null || _b === void 0 ? void 0 : _b[0].text;
        res.json({ rewrittenText });
    }
    catch (error) {
        res.status(500).json({
            message: 'something went wrong with rewrite method:- ' + error
        });
    }
});
exports.rewrite = rewrite;
