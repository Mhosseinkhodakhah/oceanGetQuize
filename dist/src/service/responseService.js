"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
class response {
    constructor(req, res, scope, statusCode, error, data) {
        const payload = {
            success: (statusCode === 200) ? true : false,
            scope: scope,
            error: error,
            data: data,
        };
        return res.status(statusCode).json(payload);
    }
}
exports.response = response;
