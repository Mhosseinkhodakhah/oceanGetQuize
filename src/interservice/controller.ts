import contentModel from "../DB/models/content";
import cacher from "../service/cach";
import { response } from "../service/responseService";


export default class interServiceController {

    async putPhoto(req: any, res: any, next: any) {
        const {photo , aPhoto , ePhoto} = req.body;
        const content = await contentModel.findById(req.params.contentId)
        await content?.updateOne({$addToSet : {pictures : photo , aPictures : aPhoto , ePictures : ePhoto}})
        await content?.save()
        return next(new response(req , res , 'put content photos' , 200 , null , 'pictures successfulley puted'))
    }


    async resetCache(req: any, res: any, next: any){
        await cacher.reset()
        return next(new response(req , res , 'reset cache for content service' , 200 , null , 'cache reseted successfull . . .'))
    }
    
    
}