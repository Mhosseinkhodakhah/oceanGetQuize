import mongoose , { Schema , model } from "mongoose";
import joi from 'joi';
import { levelDB } from "../../interfaces";


const levelSchema = new Schema<levelDB>({
    number : {type : Number , unique : true},
    reward : {type : Number},
    rewarded : {type : Boolean , default:false},
    lesson : {type : mongoose.Types.ObjectId , ref : 'lessons'},
    passedUsers : [String],
    questions : [{type : mongoose.Types.ObjectId , ref : 'questions'}]
},{timestamps:true})


const levelModel = model<levelDB>('levels' , levelSchema)

export default levelModel;