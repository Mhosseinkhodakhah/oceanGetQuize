import express, { Express, Request, Response , Application } from 'express'
import dotenv from 'dotenv'
import winston from 'winston'
import expressWinston from 'express-winston'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
// import xss from "xss-clean"
import ratelimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import responseTime from 'response-time'
import { createLogger, format, transports } from 'winston'
import connection from './src/DB/connection'
import router from './src/router'
import interservice from './src/interservice/router'
import adminRouter from './src/admin/router'
const { combine, timestamp, label, prettyPrint } = format;

dotenv.config({path : './config/config.env'})

const app : Application = express();

// security 
app.use(mongoSanitize())
app.use(cors())
app.use(helmet())
app.use(hpp())
// app.use(xss())


//database connecting
connection()


//set logger
app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console(), new (winston.transports.File)({ filename: 'myLogs.log' })],
        format: format.combine(
            label({ label: 'right meow!' }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            prettyPrint()
        ),
        statusLevels: true,
        meta: true,
        msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
        expressFormat: true,
        ignoreRoute() {
            return false;
        },
    })
);

// inside logger!!!!
winston.configure({
    format: format.combine(

        label({ label: 'right meow!' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        prettyPrint()
    ),
    transports: [
        new (winston.transports.File)({ filename: 'inside.log' }),
        // new winston.transports.Console()
    ],
})

app.use(cookieParser())


process.on('unhandledRejection', (error) => {
    console.log('error occured . . .', error)
});

process.on('uncaughtException', (error) => {
    console.log('error occured', error)
})

process.on('unhandledException', (error) => {
    console.log('error occured . . .', error)
})





app.use(express.json({ limit: "25mb" }));


const port = process.env.PORT || 5001;

app.listen(port , ()=>{
    console.log('quize get server is running successfully . . .')
})
app.use((err : any, req:any, res:any, next:any) => {
    console.error(err.stack);
    res.status(500).json(
        { message: 'الله اکبر . . .' });
});

app.use('/app' , router)

app.use('/app/interservice' , interservice)

app.use('/' , adminRouter)