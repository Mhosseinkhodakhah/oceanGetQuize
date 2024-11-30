"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const interservice = (0, express_1.Router)();
const controller = new controller_1.default;
interservice.put('/put-content-photo/:contentId', controller.putPhoto);
interservice.patch('/reset-cache', controller.resetCache);
exports.default = interservice;
