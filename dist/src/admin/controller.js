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
const responseService_1 = require("../service/responseService");
const lesson_1 = __importDefault(require("../DB/models/lesson"));
const subLesson_1 = __importDefault(require("../DB/models/subLesson"));
const level_1 = __importDefault(require("../DB/models/level"));
const question_1 = __importDefault(require("../DB/models/question"));
const cach_1 = __importDefault(require("../service/cach"));
class adminController {
    getLevels(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheData = yield cach_1.default.getter('admin-getLevels');
            let finalData;
            let level;
            if (cacheData) {
                console.log('read throw cache . . .');
                finalData = cacheData;
            }
            else {
                console.log('cache is empty . . .');
                finalData = yield question_1.default.find({ level: req.params.levelId });
                level = yield level_1.default.findById(req.params.levelId);
                console.log('final data', finalData);
                // await cacher.setter('admin-getLevels', {questions : finalData , level : level?.toObject() })
            }
            return next(new responseService_1.response(req, res, 'get levels', 200, null, { questions: finalData, level: level }));
        });
    }
    getSubLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheData = yield cach_1.default.getter(`admin-getSubLesson-${req.params.sublessonId}`);
            let subLesson;
            if (cacheData) {
                console.log('read throw cach . . .');
                subLesson = cacheData;
            }
            else {
                console.log('cache is empty . . .');
                subLesson = yield subLesson_1.default.findById(req.params.sublessonId).populate('contents').populate('lesson');
                if (!subLesson) {
                    return next(new responseService_1.response(req, res, 'get specific subLesson', 404, 'this sublesson is not exist on database', null));
                }
                yield cach_1.default.setter(`admin-getSubLesson-${req.params.sublessonId}`, subLesson);
            }
            return next(new responseService_1.response(req, res, 'get specific subLesson', 200, null, subLesson));
        });
    }
    getLessons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheData = yield cach_1.default.getter('admin-getLessons');
            let finalData;
            if (cacheData) {
                finalData = cacheData;
            }
            else {
                const lessons = yield lesson_1.default.find().populate({
                    path: 'sublessons',
                    populate: {
                        path: 'contents',
                        select: 'internalContent',
                    }
                });
                yield cach_1.default.setter('admin-getLessons', lessons);
                finalData = lessons;
            }
            return next(new responseService_1.response(req, res, 'get lessons', 200, null, finalData));
        });
    }
}
exports.default = adminController;
