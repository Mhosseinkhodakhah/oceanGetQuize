import { validationResult } from "express-validator";
import contentService from "./services";
import { lessonRole } from "./validators";
import { response } from "./service/responseService";
import lessonModel from "./DB/models/lesson";
import subLessonModel from "./DB/models/subLesson";
import { lessonDB } from "./interfaces";
import contentModel from "./DB/models/content";
import levelModel from "./DB/models/level";
import questionModel from "./DB/models/questions";
import { level } from "winston";
import interConnection from "./interservice/connection";
import internalCache from "./service/cach";
import cacher from "./service/cach";


const services = new contentService()

const connection = new interConnection()



export default class contentController {


    async getLessons(req: any, res: any, next: any) {
        const language = req.params.lang;
        let lessons;
        let allLessons = await cacher.getter('getLessons')
        if (!allLessons) {                                       // when cache was not exist . . .
            console.log('cache was empty . . .')
            const data = await services.makeReadyData()
            await cacher.setter('getLessons', data)
            switch (language) {
                case 'english':
                    lessons = data.english
                    break;
                case 'arabic':
                    lessons = data.arabic
                    break;
                case 'persian':
                    lessons = data.persian
                    break;

                default:
                    return next(new response(req, res, 'get lessons', 400, 'please select a language on params', null))
                    break;
            }
        } else {
            console.log('read throw cache . . .')                                      // when cache exist 
            switch (language) {
                case 'english':
                    lessons = allLessons.english
                    break;
                case 'arabic':
                    lessons = allLessons.arabic
                    break;
                case 'persian':
                    lessons = allLessons.persian
                    break;

                default:
                    return next(new response(req, res, 'get lessons', 400, 'please select a language on params', null))
                    break;
            }
        }
        return next(new response(req, res, 'get lessons', 200, null, lessons))
    }



    async getSubLesson(req: any, res: any, next: any) {
        const language = req.params.lang;
        let sublessonContent;
        sublessonContent = await contentModel.findById( req.params.contentId)
        if (!sublessonContent){
            return next(new response(req, res, 'get specific subLesson', 400, 'this content is not exist', null))
        }

        return next(new response(req, res, 'get specific subLesson', 200, null, sublessonContent))
    }




    async getContent(req: any, res: any, next: any) {
        const content = await contentModel.findById(req.params.contentId).populate('subLesson')
        return next(new response(req, res, 'get specific content', 200, null, content))
    }



    async seenContent(req: any, res: any, next: any) {
        const content = await contentModel.findByIdAndUpdate(req.params.contentId, { $addToSet: { seen: req.user.id } })
        await services.checkSeen(content?.subLesson, req.user.id)
        return next(new response(req, res, 'seen content', 200, null, 'content seen by user!'))
    }




    async getLevels(req: any, res: any, next: any) {
        console.log('its hereee')
        let userId = req.user.id;
        let levels;
        let userLevels = await cacher.getter('getLevels')                 // get all levels data from cache
        if (userLevels) {                       // cache is exist
            if (!userLevels[userId]) {           // but this userslevel is not exist
                console.log('cache is not exist . . .')
                const data = await services.readyLevelsData(userId)     // make the levels ready for this user
                userLevels[userId] = data                                      // add new userLevels to cache data
                await cacher.setter('getLevels' , userLevels)                    // cache heat the new data
                levels = data                                                   
            } else {                                // this userLevels are exist on cache
                console.log('cache is ready . . .')
                levels = userLevels[userId]                 
            }
        } else {                                    // if cache was totaly empty
            console.log('cache is empty . .. .')
            const data = await services.readyLevelsData(userId)         // make this userlevels dat a for cache
            userLevels = {}                                         // make structure of cache data
            userLevels[userId] = data                           // add this userLevels to cachData
            await cacher.setter('getLevels' , userLevels)
            levels = data
        }

        return next(new response(req, res, 'get levels', 200, null, levels))
    }




    async openLevel(req: any, res: any, next: any) {
        let userId = req.user.id;
        const level = await levelModel.findOne({ number: req.params.number })
        if (level?.passedUsers.includes(userId)) {
            const questiotns = await questionModel.find({ level: level?._id }).limit(10)
            return next(new response(req, res, 'open level', 200, null, { questions: questiotns }))
        }
        const questiotns = await questionModel.find({ $and: [{ level: level?._id }, { passedUser: { $ne: userId } }] }).limit(10)
        return next(new response(req, res, 'open level', 200, null, { questions: questiotns }))
    }




    //! needs to review
    async answer(req: any, res: any, next: any) {
        const answers = req.body
        let trueAnswers: number = 0;
        const question = await questionModel.findOne({ questionForm: answers[0].questionForm })
        for (let i = 0; i < answers.length; i++) {
            let title = answers[i].questionForm;
            if (question?.options[question?.trueOption] == answers[i].answer) {
                trueAnswers++;
                await questionModel.findOneAndUpdate({ questionForm: title }, { $push: { passedUser: req.user.id } })
            }
        }
        if (trueAnswers == 10) {
            const level = await levelModel.findByIdAndUpdate(question?.level, { $push: { passedUsers: req.user.id } })
            const rewarded = await connection.putReward(req.user.id, level?.reward, `passed ${level?.number} level`)
            if (rewarded.success) {
                await levelModel.findByIdAndUpdate(level?._id, { rewarded: true })
            }
            const lessonLevels = await lessonModel.findById(level?.lesson).populate('levels').select('levels')
            for (let j = 0; j < lessonLevels?.levels.length; j++) {
                if (lessonLevels?.levels[j].passedUser.includes(req.user.id)) {
                    await lessonModel.findByIdAndUpdate(level?.lesson, { $push: { paasedQuize: req.user.id } })
                    return next(new response(req, res, 'answer questions', 200, null, { message: 'congratulation! you passed this quize' }))
                }
            }
        } else {
            return next(new response(req, res, 'answer questions', 200, null, { message: 'sorry! you cant pass this level! please review the lesson and try again' }))
        }
    }



    async getAllContent(req: any, res: any, next: any){
        const contents = await contentModel.find()
        return next (new response(req , res , 'get contents' , 200 , null , contents))
    }


}