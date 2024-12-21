import { validationResult } from "express-validator"
import { response } from "../service/responseService"
import lessonModel from "../DB/models/lesson"
import subLessonModel from "../DB/models/subLesson"
import contentModel from "../DB/models/content"
import levelModel from "../DB/models/level"
import questionModel from "../DB/models/question"
import internalCache from "../service/cach"
import cacher from "../service/cach"




export default class adminController {

    async getLevels(req: any, res: any, next: any) {
        let cacheData = await cacher.getter('admin-getLevels')
        let finalData;
        let level;
        if (cacheData) {
            console.log('read throw cache . . .')
            finalData = cacheData;
        } else {
            console.log('cache is empty . . .')
            finalData = await questionModel.find({level : req.params.levelId})
            level = await levelModel.findById(req.params.levelId)
            console.log('final data' , finalData)
            // await cacher.setter('admin-getLevels', {questions : finalData , level : level?.toObject() })
        }
        return next(new response(req, res, 'get levels', 200, null, {questions : finalData , level : level }))
    }


    async getSubLesson(req: any, res: any, next: any) {
        let cacheData = await cacher.getter(`admin-getSubLesson-${req.params.sublessonId}`)
        let subLesson;
        if (cacheData) {
            console.log('read throw cach . . .')
            subLesson = cacheData
        } else {
            console.log('cache is empty . . .')
            subLesson = await subLessonModel.findById(req.params.sublessonId).populate('contents').populate('lesson')
            if (!subLesson) {
                return next(new response(req, res, 'get specific subLesson', 404, 'this sublesson is not exist on database', null))
            }
            await cacher.setter(`admin-getSubLesson-${req.params.sublessonId}`, subLesson)

        }
        return next(new response(req, res, 'get specific subLesson', 200, null, subLesson))
    }


    async getLessons(req: any, res: any, next: any) {
        let cacheData = await cacher.getter('admin-getLessons')
        let finalData;
        if (cacheData) {
            finalData = cacheData;
        } else {
            const lessons = await lessonModel.find().populate({
                path: 'sublessons',
                populate: {
                    path: 'contents',
                    select: 'internalContent',
                }
            })
            await cacher.setter('admin-getLessons', lessons)
            finalData = lessons
        }
        return next(new response(req, res, 'get lessons', 200, null, finalData))
    }




}