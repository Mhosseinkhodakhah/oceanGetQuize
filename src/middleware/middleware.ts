import jwt from 'jsonwebtoken'
import { response } from '../service/responseService';
import messages from '../service/responseMessages';


export default class middleWare {
    async auth(req: any, res: any, next: any) {
        let token: string = req.headers.authorization;
        let lang : string = req.query.lang;
        let Error = (lang && lang != '') ? messages[lang].tokenError : messages['english'].tokenError
        if (!token || !token.startsWith("Bearer")){
            return next(new response(req , res , 'authorization' , 401 , Error , null))
        }

        try {
            const newToken = token.split(" ")[1]
            const decoded : any = jwt.verify(newToken , `${process.env.ACCESSKEY}`)
            if (!decoded){
                return next(new response(req , res , 'authorization' , 401 , Error , null))
            }
            req.user = decoded;
            next()
        } catch (error) {
            console.log('error occured in authorization >>>>' , `${error}`)
            return next(new response(req , res , 'authorization' , 401 , Error , null))
        }
    }
    
    async adminAuth(req: any, res: any, next: any) {
        let token: string = req.headers.authorization;

        if (!token || !token.startsWith("Bearer")){
            return next(new response(req , res , 'authorization' , 401 , 'token Expire!' , null))
        }

        try {
            const newToken = token.split(" ")[1]
            const decoded : any = jwt.verify(newToken , `${process.env.ADMINACCESSKEY}`)
            if (!decoded){
                return next(new response(req , res , 'authorization' , 401 , 'token Expire!' , null))
            }
            req.user = decoded;
            next()
        } catch (error) {
            console.log('error occured in authorization >>>>' , `${error}`)
            return next(new response(req , res , 'authorization' , 401 , 'token Expire!' , null))
        }
    }
}