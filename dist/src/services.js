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
const content_1 = __importDefault(require("./DB/models/content"));
const lesson_1 = __importDefault(require("./DB/models/lesson"));
const level_1 = __importDefault(require("./DB/models/level"));
const subLesson_1 = __importDefault(require("./DB/models/subLesson"));
const connection_1 = __importDefault(require("./interservice/connection"));
const connection = new connection_1.default();
class contentService {
    checkSeen(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield content_1.default.find({ subLesson: id });
            const seenContents = yield content_1.default.find({ $and: [{ subLesson: id }, { seen: { $in: userId } }] });
            console.log(contents.length, seenContents.length);
            const sublesson = yield subLesson_1.default.findById(id);
            let lessonId = sublesson === null || sublesson === void 0 ? void 0 : sublesson.lesson;
            if (contents.length == seenContents.length) {
                yield subLesson_1.default.findByIdAndUpdate(id, { $addToSet: { seen: userId } });
                const sublessons = yield subLesson_1.default.find({ lesson: lessonId });
                const seenSubLessons = yield subLesson_1.default.find({ $and: [{ lesson: lessonId }, { seen: { $in: userId } }] });
                if (sublessons.length == seenSubLessons.length) {
                    console.log('here passed . . .');
                    const seenLesson = yield lesson_1.default.findByIdAndUpdate(lessonId, { $addToSet: { seen: userId } });
                    const rewardResponse = yield connection.putReward(userId, seenLesson === null || seenLesson === void 0 ? void 0 : seenLesson.reward, `finished ${seenLesson === null || seenLesson === void 0 ? void 0 : seenLesson.name} Lesson`);
                    if (rewardResponse.success) {
                        yield lesson_1.default.findByIdAndUpdate(lessonId, { rewarded: true });
                    }
                }
            }
        });
    }
    /**
     * this module seprate a languages for caching all lessons data
     */
    makeReadyData() {
        return __awaiter(this, void 0, void 0, function* () {
            const english = yield lesson_1.default.find().populate({
                path: 'sublessons',
                populate: {
                    path: 'subLessons',
                },
                select: ['-name', '-aName']
            }).select(['-name', '-aName']);
            const arabic = yield lesson_1.default.find().populate({
                path: 'sublessons',
                populate: {
                    path: 'subLessons',
                },
                select: ['-name', '-eName']
            }).select(['-name', '-eName']);
            const persian = yield lesson_1.default.find().populate({
                path: 'sublessons',
                populate: {
                    path: 'subLessons',
                },
                select: ['-eName', '-aName']
            }).select(['-eName', '-aName']);
            return { persian: persian, arabic: arabic, english: english };
        });
    }
    /**
     * this mudule seprate data based on the languages for caching just sublessons data
     */
    readySubLessonsData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const asub = yield subLesson_1.default.findById(id).populate('contents').select(['-eName', '-name']);
            const esub = yield subLesson_1.default.findById(id).populate('contents').select(['-aName', '-name']);
            const sub = yield subLesson_1.default.findById(id).populate('contents').select(['-aName', '-eName']);
            return { persian: sub, english: esub, arabic: asub };
        });
    }
    /**
     * this mudule seprate data based on the languages for caching just sublessons data
     */
    readyLevelsData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const all = yield level_1.default.find().populate('lesson');
            let allLevels = [];
            for (let i = 0; i < all.length; i++) {
                const level = all[i].toObject();
                console.log(level.lesson.paasedQuize);
                let newData;
                if (level.lesson.paasedQuize.includes(id)) {
                    newData = Object.assign(Object.assign({}, level), { mode: 2 }); // passed the quize
                }
                else if (level.lesson.seen.includes(id)) {
                    newData = Object.assign(Object.assign({}, level), { mode: 1 }); // open but didnt passed the quize
                }
                else {
                    newData = Object.assign(Object.assign({}, level), { mode: 0 }); // open but didnt passed the quize
                }
                allLevels.push(newData);
            }
            return allLevels;
        });
    }
}
exports.default = contentService;
