import mongoose,{ Schema , model } from "mongoose";
import joi from 'joi';
import { questionDB } from "../../interfaces";



const questionsSchema = new Schema<questionDB>({
    questionForm : {type : String , require : true},
    eQuestionForm : {type : String , require : true},
    aQuestionForm : {type : String , require : true},
    options : [String],
    eOptions : [String],
    aOptions : [String],
    trueOption : {type : Number},
    time : {type : Number},
    level : {type : mongoose.Types.ObjectId , ref : 'levels'},
    passedUser : [String]
})


const questionModel = model<questionDB>('questions' , questionsSchema)

export default questionModel