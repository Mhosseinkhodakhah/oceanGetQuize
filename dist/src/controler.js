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
const services_1 = __importDefault(require("./services"));
const responseService_1 = require("./service/responseService");
const lesson_1 = __importDefault(require("./DB/models/lesson"));
const content_1 = __importDefault(require("./DB/models/content"));
const level_1 = __importDefault(require("./DB/models/level"));
const question_1 = __importDefault(require("./DB/models/question"));
const connection_1 = __importDefault(require("./interservice/connection"));
const cach_1 = __importDefault(require("./service/cach"));
const services = new services_1.default();
const connection = new connection_1.default();
class contentController {
    getLessons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.params.lang;
            let lessons;
            let allLessons = yield cach_1.default.getter('getLessons');
            if (!allLessons) { // when cache was not exist . . .
                console.log('cache was empty . . .');
                const data = yield services.makeReadyData();
                yield cach_1.default.setter('getLessons', data);
                switch (language) {
                    case 'english':
                        lessons = data.english;
                        break;
                    case 'arabic':
                        lessons = data.arabic;
                        break;
                    case 'persian':
                        lessons = data.persian;
                        break;
                    default:
                        return next(new responseService_1.response(req, res, 'get lessons', 400, 'please select a language on params', null));
                        break;
                }
            }
            else {
                console.log('read throw cache . . .'); // when cache exist 
                switch (language) {
                    case 'english':
                        lessons = allLessons.english;
                        break;
                    case 'arabic':
                        lessons = allLessons.arabic;
                        break;
                    case 'persian':
                        lessons = allLessons.persian;
                        break;
                    default:
                        return next(new responseService_1.response(req, res, 'get lessons', 400, 'please select a language on params', null));
                        break;
                }
            }
            return next(new responseService_1.response(req, res, 'get lessons', 200, null, lessons));
        });
    }
    getSubLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.params.lang;
            let sublessonContent;
            sublessonContent = yield content_1.default.findById(req.params.contentId);
            if (!sublessonContent) {
                return next(new responseService_1.response(req, res, 'get specific subLesson', 400, 'this content is not exist', null));
            }
            return next(new responseService_1.response(req, res, 'get specific subLesson', 200, null, sublessonContent));
        });
    }
    getContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield content_1.default.findById(req.params.contentId).populate('subLesson');
            return next(new responseService_1.response(req, res, 'get specific content', 200, null, content));
        });
    }
    seenContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield content_1.default.findByIdAndUpdate(req.params.contentId, { $addToSet: { seen: req.user.id } });
            yield services.checkSeen(content === null || content === void 0 ? void 0 : content.subLesson, req.user.id);
            return next(new responseService_1.response(req, res, 'seen content', 200, null, 'content seen by user!'));
        });
    }
    getLevels(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('its hereee');
            let userId = req.user.id;
            let levels;
            let userLevels = yield cach_1.default.getter('getLevels'); // get all levels data from cache
            if (userLevels) { // cache is exist
                if (!userLevels[userId]) { // but this userslevel is not exist
                    console.log('cache is not exist . . .');
                    const data = yield services.readyLevelsData(userId); // make the levels ready for this user
                    userLevels[userId] = data; // add new userLevels to cache data
                    yield cach_1.default.setter('getLevels', userLevels); // cache heat the new data
                    levels = data;
                }
                else { // this userLevels are exist on cache
                    console.log('cache is ready . . .');
                    levels = userLevels[userId];
                }
            }
            else { // if cache was totaly empty
                console.log('cache is empty . .. .');
                const data = yield services.readyLevelsData(userId); // make this userlevels dat a for cache
                userLevels = {}; // make structure of cache data
                userLevels[userId] = data; // add this userLevels to cachData
                yield cach_1.default.setter('getLevels', userLevels);
                levels = data;
            }
            return next(new responseService_1.response(req, res, 'get levels', 200, null, levels));
        });
    }
    openLevel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.user.id;
            let lang = req.params.lang;
            const level = yield level_1.default.findById(req.params.levelId);
            // if (level?.passedUsers.includes(userId)) {
            // }
            const questiotns = yield question_1.default.find({ $and: [{ level: level === null || level === void 0 ? void 0 : level._id }, { passedUser: { $ne: req.user.id } }] }).limit(10);
            let data = [];
            questiotns.forEach((elem) => {
                let objectElem = elem.toObject();
                let newquestion = {};
                if (lang == 'english') {
                    newquestion = Object.assign(Object.assign({}, objectElem), { questionForm: objectElem.eQuestionForm, options: objectElem.eOptions });
                }
                if (lang == 'arabic') {
                    newquestion = Object.assign(Object.assign({}, objectElem), { questionForm: objectElem.eQuestionForm, options: objectElem.eOptions });
                }
                data.push(newquestion);
            });
            return next(new responseService_1.response(req, res, 'open level', 200, null, { questions: data }));
        });
    }
    //! needs to review
    answer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = req.body;
            let trueAnswers = 0;
            const question = yield question_1.default.findOne({ questionForm: answers[0].questionForm });
            for (let i = 0; i < answers.length; i++) {
                let title = answers[i].questionForm;
                if ((question === null || question === void 0 ? void 0 : question.options[question === null || question === void 0 ? void 0 : question.trueOption]) == answers[i].answer) {
                    trueAnswers++;
                    yield question_1.default.findOneAndUpdate({ questionForm: title }, { $push: { passedUser: req.user.id } });
                }
            }
            if (trueAnswers == 10) {
                const level = yield level_1.default.findByIdAndUpdate(question === null || question === void 0 ? void 0 : question.level, { $push: { passedUsers: req.user.id } });
                const rewarded = yield connection.putReward(req.user.id, level === null || level === void 0 ? void 0 : level.reward, `passed ${level === null || level === void 0 ? void 0 : level.number} level`);
                if (rewarded.success) {
                    yield level_1.default.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, { rewarded: true });
                }
                const lessonLevels = yield lesson_1.default.findById(level === null || level === void 0 ? void 0 : level.lesson).populate('levels').select('levels');
                for (let j = 0; j < (lessonLevels === null || lessonLevels === void 0 ? void 0 : lessonLevels.levels.length); j++) {
                    if (lessonLevels === null || lessonLevels === void 0 ? void 0 : lessonLevels.levels[j].passedUser.includes(req.user.id)) {
                        yield lesson_1.default.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level.lesson, { $push: { paasedQuize: req.user.id } });
                        return next(new responseService_1.response(req, res, 'answer questions', 200, null, { message: 'congratulation! you passed this quize' }));
                    }
                }
            }
            else {
                return next(new responseService_1.response(req, res, 'answer questions', 200, null, { message: 'sorry! you cant pass this level! please review the lesson and try again' }));
            }
        });
    }
    getAllContent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const contents = yield content_1.default.find();
            return next(new responseService_1.response(req, res, 'get contents', 200, null, contents));
        });
    }
}
exports.default = contentController;
