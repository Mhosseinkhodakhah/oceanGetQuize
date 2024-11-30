import mongoose, { Schema, model } from 'mongoose'

import joi from 'joi'
import { content } from '../../interfaces'



const contentSchema = new Schema<content>({

    internalContent: {
        
    },
    
    pictures : [String],
    ePictures : [String],
    aPictures : [String],
    
    seen:[String],
    
    subLesson : { type: mongoose.Types.ObjectId , ref: 'subLessons' }

})



const contentModel = model<content>('contents', contentSchema)

export default contentModel;