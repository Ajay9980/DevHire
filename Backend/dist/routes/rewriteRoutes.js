"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rewriteController_1 = require("../controllers/rewriteController");
const router = express_1.default.Router();
router.post('/rewrite', rewriteController_1.rewrite);
exports.default = router;
