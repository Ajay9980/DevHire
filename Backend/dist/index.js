"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const taskSubmissionRoutes_1 = __importDefault(require("./routes/taskSubmissionRoutes"));
const bidRoutes_1 = __importDefault(require("./routes/bidRoutes"));
const rewriteRoutes_1 = __importDefault(require("./routes/rewriteRoutes"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/user', userRoutes_1.default);
app.use('/api/task', taskRoutes_1.default);
app.use('/api/tasksubmission', taskSubmissionRoutes_1.default);
app.use('/api/bid', bidRoutes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use('/api/rewrite', rewriteRoutes_1.default);
app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
});
