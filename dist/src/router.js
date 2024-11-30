"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controler_1 = __importDefault(require("./controler"));
const middleware_1 = __importDefault(require("./middleware/middleware"));
const controller = new controler_1.default();
const auth = new middleware_1.default().auth;
const router = (0, express_1.Router)();
router.get('/get-levels', auth, controller.getLevels);
router.get('/open-level/:number', auth, controller.openLevel);
exports.default = router;
