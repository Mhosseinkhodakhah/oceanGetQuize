import mongoose, { Schema, model } from 'mongoose'

import joi from 'joi'
import { content } from '../../interfaces'



const contentSchema = new Schema<content>({

    internalContent: {
        title: { type: String, default: '' },
        aTitle: { type: String, default: '' },
        eTitle: { type: String, default: '' },
        describtion: { type: String, default: '' },
        eDescribtion: { type: String, default: '' },
        aDescribtion: { type: String, default: '' },
    },

    pictures: [String],
    ePictures: [String],
    aPictures: [String],

    seen: [String],

    subLesson: { type: mongoose.Types.ObjectId, ref: 'subLessons' }

}, { timestamps: true })



const contentModel = model<content>('contents', contentSchema)

export default contentModel;