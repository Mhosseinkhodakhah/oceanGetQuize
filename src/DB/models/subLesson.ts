import mongoose, { Schema , model, mongo } from "mongoose";
import joi from 'joi'
import { subLessonDB } from "../../interfaces";


const subLessonSchema = new Schema<subLessonDB>({
    name : {type : String},
    eName : {type : String},
    aName : {type : String},
    number : {type : Number},
    lesson : {type : mongoose.Types.ObjectId , ref : 'lessons'},
    content : {type : mongoose.Types.ObjectId , ref : 'contents'},
    seen:[String],
    subLessons:[{
        eName : {type:String},
        number : {type:Number},
        // aName : {type:String},
        // name : {type:String},
        content:{type : mongoose.Types.ObjectId , ref : "contents"}
    }]
},{timestamps:true})


const subLessonModel = model<subLessonDB>('subLessons' , subLessonSchema)

export default subLessonModel