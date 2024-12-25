import { validationResult } from "express-validator";
import contentService from "./services";
import { lessonRole } from "./validators";
import { response } from "./service/responseService";
import lessonModel from "./DB/models/lesson";
import subLessonModel from "./DB/models/subLesson";
import { lessonDB } from "./interfaces";
import contentModel from "./DB/models/content";
import levelModel from "./DB/models/level";
import questionModel from "./DB/models/question";
import { level } from "winston";
import interConnection from "./interservice/connection";
import internalCache from "./service/cach";
import cacher from "./service/cach";
import messages from "./service/responseMessages";


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
        sublessonContent = await contentModel.findById(req.params.contentId)
        if (!sublessonContent) {
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
                await cacher.setter('getLevels', userLevels)                    // cache heat the new data
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
            await cacher.setter('getLevels', userLevels)
            levels = data
        }

        return next(new response(req, res, 'get levels', 200, null, levels))
    }




    async openLevel(req: any, res: any, next: any) {
        let userId = req.user.id;
        let lang = req.params.lang;
        try {
            console.log('cache is empty . . .')
            const level = await levelModel.findById(req.params.levelId)
            // const questiotns = await questionModel.find({level: level?._id }).limit(10)
            const allQuestiotns = await questionModel.find()
            let randomIndex = Math.floor(Math.random()*10)
            let lastIndex = randomIndex + 10
            let questiotns = allQuestiotns.splice(randomIndex , lastIndex)
            console.log(questiotns.length)
            let data: {}[] = []
            questiotns.forEach((elem: any) => {
                let objectElem = elem.toObject()
                let newquestion: {} = {};
                if (lang == 'english') {
                    newquestion = { ...objectElem, questionForm: objectElem.eQuestionForm, options: objectElem.eOptions }
                }
                if (lang == 'arabic') {
                    newquestion = { ...objectElem, questionForm: objectElem.aQuestionForm, options: objectElem.aOptions }
                }
                if (lang == 'persian') {
                    newquestion = { ...objectElem };
                }
                data.push(newquestion)
            })
            return next(new response(req, res, 'open level', 200, null, { questions: data }))
        } catch (error) {
            console.log(`error occured in open level ${error}`)
            let internalError = messages[lang].unknownError
            return next(new response(req, res, 'open level', 500, internalError, null))
        }
    }



    async getAllContent(req: any, res: any, next: any) {
        const contents = await contentModel.find()
        return next(new response(req, res, 'get contents', 200, null, contents))
    }


}