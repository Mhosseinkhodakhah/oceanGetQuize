import contentModel from "./DB/models/content";
import lessonModel from "./DB/models/lesson";
import levelModel from "./DB/models/level";
import subLessonModel from "./DB/models/subLesson";
import interConnection from "./interservice/connection";

const connection = new interConnection()


export default class contentService {

    async checkSeen(id: string, userId: string) {
        const contents = await contentModel.find({ subLesson: id })
        const seenContents = await contentModel.find({ $and: [{ subLesson: id }, { seen: { $in: userId } }] })
        console.log(contents.length, seenContents.length)

        const sublesson = await subLessonModel.findById(id)
        let lessonId = sublesson?.lesson

        if (contents.length == seenContents.length) {

            await subLessonModel.findByIdAndUpdate(id, { $addToSet: { seen: userId } })
            const sublessons = await subLessonModel.find({ lesson: lessonId })
            const seenSubLessons = await subLessonModel.find({ $and: [{ lesson: lessonId }, { seen: { $in: userId } }] })
            if (sublessons.length == seenSubLessons.length) {
                console.log('here passed . . .')
                const seenLesson = await lessonModel.findByIdAndUpdate(lessonId, { $addToSet: { seen: userId } })
                const rewardResponse = await connection.putReward(userId, seenLesson?.reward, `finished ${seenLesson?.name} Lesson`)
                if (rewardResponse.success) {
                    await lessonModel.findByIdAndUpdate(lessonId, { rewarded: true })
                }
            }
        }
    }


    /**
     * this module seprate a languages for caching all lessons data
     */
    async makeReadyData() {
        const english = await lessonModel.find().populate({
            path: 'sublessons',
            populate: {
                path: 'subLessons',
            },
            select: ['-name', '-aName']
        }).select(['-name', '-aName'])

        const arabic = await lessonModel.find().populate({
            path: 'sublessons',
            populate: {
                path: 'subLessons',
            },
            select: ['-name', '-eName']
        }).select(['-name', '-eName'])

        const persian = await lessonModel.find().populate({
            path: 'sublessons',
            populate: {
                path: 'subLessons',
            },
            select: ['-eName', '-aName']
        }).select(['-eName', '-aName'])

        return { persian: persian, arabic: arabic, english: english }
    }

    /**
     * this mudule seprate data based on the languages for caching just sublessons data
     */
    async readySubLessonsData(id: any) {
        const asub = await subLessonModel.findById(id).populate('contents').select(['-eName', '-name'])
        const esub = await subLessonModel.findById(id).populate('contents').select(['-aName', '-name'])
        const sub = await subLessonModel.findById(id).populate('contents').select(['-aName', '-eName'])
        return { persian: sub, english: esub, arabic: asub }
    }



    /**
     * this mudule seprate data based on the languages for caching just sublessons data
     */
    async readyLevelsData(id: any) {
        const all = await levelModel.find().populate('lesson').sort({number : 1})
        let allLevels = [];
        for (let i = 0; i < all.length; i++) {
            const level = all[i].toObject()
            let newData;
            let mode : number;
            if (!level.lesson.seen.includes(id)){
                mode = 0
            }else if(level.passedUsers.includes(id)){
                mode = 2
            }else{
                mode = 1
            }

            newData = {...level , mode : mode}

            allLevels.push(newData)
        }
        return allLevels
    }



    //////////!last line
}