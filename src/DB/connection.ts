import mongoose from 'mongoose'


export default async () => {
    mongoose.connect(`${process.env.mongo}`).then(()=>{
        console.log('database connected . . .')
    }).catch((err : any)=>{
        console.log(err)
    })
}