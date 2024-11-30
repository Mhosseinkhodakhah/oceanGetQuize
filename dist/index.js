"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
const winston_2 = require("winston");
const connection_1 = __importDefault(require("./src/DB/connection"));
const router_1 = __importDefault(require("./src/router"));
const router_2 = __importDefault(require("./src/interservice/router"));
const router_3 = __importDefault(require("./src/admin/router"));
const { combine, timestamp, label, prettyPrint } = winston_2.format;
dotenv_1.default.config({ path: './config/config.env' });
const app = (0, express_1.default)();
// security 
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
// app.use(xss())
//database connecting
(0, connection_1.default)();
//set logger
app.use(express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console(), new (winston_1.default.transports.File)({ filename: 'myLogs.log' })],
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
        return false;
    },
}));
// inside logger!!!!
winston_1.default.configure({
    format: winston_2.format.combine(label({ label: 'right meow!' }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prettyPrint()),
    transports: [
        new (winston_1.default.transports.File)({ filename: 'inside.log' }),
        // new winston.transports.Console()
    ],
});
app.use((0, cookie_parser_1.default)());
process.on('unhandledRejection', (error) => {
    console.log('error occured . . .', error);
});
process.on('uncaughtException', (error) => {
    console.log('error occured', error);
});
process.on('unhandledException', (error) => {
    console.log('error occured . . .', error);
});
app.use(express_1.default.json({ limit: "25mb" }));
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log('quize get server is running successfully . . .');
});
app.use('/app', router_1.default);
app.use('/app/interservice', router_2.default);
app.use('/', router_3.default);
