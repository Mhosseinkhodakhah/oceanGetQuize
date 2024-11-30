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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseService_1 = require("../service/responseService");
class middleWare {
    auth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
            }
            try {
                const newToken = token.split(" ")[1];
                const decoded = jsonwebtoken_1.default.verify(newToken, `${process.env.ACCESSKEY}`);
                if (!decoded) {
                    return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
                }
                req.user = decoded;
                next();
            }
            catch (error) {
                console.log('error occured in authorization >>>>', `${error}`);
                return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
            }
        });
    }
    adminAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers.authorization;
            if (!token || !token.startsWith("Bearer")) {
                return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
            }
            try {
                const newToken = token.split(" ")[1];
                const decoded = jsonwebtoken_1.default.verify(newToken, `${process.env.ADMINACCESSKEY}`);
                if (!decoded) {
                    return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
                }
                req.user = decoded;
                next();
            }
            catch (error) {
                console.log('error occured in authorization >>>>', `${error}`);
                return next(new responseService_1.response(req, res, 'authorization', 401, 'token Expire!', null));
            }
        });
    }
}
exports.default = middleWare;
